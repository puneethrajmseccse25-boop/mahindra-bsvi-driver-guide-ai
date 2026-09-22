from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
java_path = ROOT / "app/src/main/java/com/mahindra/bsvi/MainActivity.java"

java = java_path.read_text(encoding="utf-8")

# Replace only the secure login transport. The backend already proves doPost completes;
# this version uses a small, deterministic redirect reader with shorter bounded timeouts,
# closes every stream, and retries a login once on a socket timeout.
start = java.find("        @JavascriptInterface\n        public void secureLogin(")
end = java.find("        @JavascriptInterface\n        public void cloudRequest(", start)
if start < 0 or end < 0:
    raise RuntimeError("secureLogin/cloudRequest markers not found")

replacement = r'''        @JavascriptInterface
        public void secureLogin(String mobile, String password) {
            new Thread(() -> {
                String response;
                int code = 0;
                try {
                    String payload = "{\"action\":\"login\",\"username\":"
                            + JSONObject.quote(mobile == null ? "" : mobile)
                            + ",\"password\":"
                            + JSONObject.quote(password == null ? "" : password)
                            + "}";
                    Exception last = null;
                    for (int attempt = 0; attempt < 2; attempt++) {
                        try {
                            String[] result = performBackendHttp("POST", API_URL, payload, true);
                            code = Integer.parseInt(result[0]);
                            response = result[1];
                            if (response == null || response.trim().isEmpty()) {
                                response = "{\"ok\":false,\"code\":" + code
                                        + ",\"error\":\"Backend returned an empty response.\"}";
                            }
                            final String finalResponse = normalizeJsonResponse(response, code);
                            web.post(() -> web.evaluateJavascript(
                                    "window.nativeLoginResult && window.nativeLoginResult("
                                            + JSONObject.quote(finalResponse) + ")",
                                    null
                            ));
                            return;
                        } catch (java.net.SocketTimeoutException timeout) {
                            last = timeout;
                            if (attempt == 0) {
                                try { Thread.sleep(400L); } catch (InterruptedException ignored) {}
                            }
                        }
                    }
                    throw last == null ? new java.io.IOException("Login request timed out.") : last;
                } catch (Exception e) {
                    response = "{\"ok\":false,\"code\":0,\"error\":\"Network error: "
                            + escapeJson(e.getMessage()) + "\"}";
                    final String finalResponse = response;
                    web.post(() -> web.evaluateJavascript(
                            "window.nativeLoginResult && window.nativeLoginResult("
                                    + JSONObject.quote(finalResponse) + ")",
                            null
                    ));
                }
            }).start();
        }

        private String normalizeJsonResponse(String response, int code) {
            String s = response == null ? "" : response.trim();
            if (s.startsWith("{") && s.endsWith("}")) return s;

            // Handle the common Apps Script / proxy HTML wrapper forms without
            // exposing the wrapper to the login UI.
            java.util.regex.Matcher meta = java.util.regex.Pattern
                    .compile("(?i)name=[\"']mahindra-json[\"'][^>]+content=[\"']([^\"']+)[\"']")
                    .matcher(s);
            if (meta.find()) {
                try {
                    String b64 = meta.group(1).replace('-', '+').replace('_', '/');
                    while (b64.length() % 4 != 0) b64 += "=";
                    byte[] raw = android.util.Base64.decode(b64, android.util.Base64.DEFAULT);
                    String decoded = new String(raw, StandardCharsets.UTF_8).trim();
                    if (decoded.startsWith("{") && decoded.endsWith("}")) return decoded;
                } catch (Exception ignored) {}
            }

            int a = s.indexOf("{");
            int z = s.lastIndexOf("}");
            if (a >= 0 && z > a) {
                String candidate = s.substring(a, z + 1).trim();
                if (candidate.startsWith("{") && candidate.endsWith("}")) return candidate;
            }

            return "{\"ok\":false,\"code\":" + code
                    + ",\"error\":\"Backend returned non-JSON response (HTTP "
                    + code + ").\"}";
        }

        private String[] performBackendHttp(
                String method,
                String url,
                String body,
                boolean loginRequest
        ) throws Exception {
            String currentUrl = url;
            String requestMethod = method == null ? "GET" : method.toUpperCase(Locale.US);
            byte[] data = (body == null ? "" : body).getBytes(StandardCharsets.UTF_8);
            String cookie = null;

            for (int hop = 0; hop < 8; hop++) {
                HttpURLConnection c = (HttpURLConnection) new URL(currentUrl).openConnection();
                try {
                    c.setRequestMethod(requestMethod);
                    c.setConnectTimeout(15000);
                    c.setReadTimeout(20000);
                    c.setUseCaches(false);
                    c.setInstanceFollowRedirects(false);
                    c.setRequestProperty("Accept", "application/json, text/plain, */*");
                    c.setRequestProperty("User-Agent", "MahindraBSVI-DriverGuideAI/1.1");
                    c.setRequestProperty("Accept-Encoding", "identity");
                    c.setRequestProperty("Connection", "close");
                    if (cookie != null && !cookie.isEmpty()) {
                        c.setRequestProperty("Cookie", cookie);
                    }

                    if ("POST".equals(requestMethod)) {
                        c.setDoOutput(true);
                        c.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                        c.setFixedLengthStreamingMode((long) data.length);
                        try (OutputStream os = new java.io.BufferedOutputStream(c.getOutputStream())) {
                            os.write(data);
                            os.flush();
                        }
                    }

                    int status = c.getResponseCode();

                    java.util.Map<String, java.util.List<String>> headers = c.getHeaderFields();
                    if (headers != null) {
                        for (java.util.Map.Entry<String, java.util.List<String>> entry : headers.entrySet()) {
                            if (entry.getKey() != null && "Set-Cookie".equalsIgnoreCase(entry.getKey())
                                    && entry.getValue() != null) {
                                for (String setCookie : entry.getValue()) {
                                    if (setCookie != null && !setCookie.trim().isEmpty()) {
                                        cookie = mergeCookie(cookie, extractCookiePair(setCookie));
                                    }
                                }
                            }
                        }
                    }

                    String location = c.getHeaderField("X-Redirect-Location");
                    if (location == null || location.trim().isEmpty()) {
                        location = c.getHeaderField("Location");
                    }

                    if (status == 301 || status == 302 || status == 303 || status == 307 || status == 308 || status == 412) {
                        if (location == null || location.trim().isEmpty()) {
                            return new String[]{String.valueOf(status),
                                    "{\"ok\":false,\"code\":" + status
                                            + ",\"error\":\"Backend redirect did not provide a response URL.\"}"};
                        }
                        currentUrl = new URL(new URL(currentUrl), location).toString();
                        if (status == 301 || status == 302 || status == 303 || status == 412) {
                            requestMethod = "GET";
                            data = new byte[0];
                        }
                        continue;
                    }

                    java.io.InputStream stream = status >= 400 ? c.getErrorStream() : c.getInputStream();
                    if (stream == null) return new String[]{String.valueOf(status), ""};

                    StringBuilder sb = new StringBuilder();
                    try (java.io.BufferedInputStream in = new java.io.BufferedInputStream(stream)) {
                        byte[] buf = new byte[8192];
                        int n;
                        while ((n = in.read(buf)) != -1) {
                            sb.append(new String(buf, 0, n, StandardCharsets.UTF_8));
                        }
                    }
                    return new String[]{String.valueOf(status), sb.toString().trim()};
                } finally {
                    c.disconnect();
                }
            }

            return new String[]{"0", "{\"ok\":false,\"code\":0,\"error\":\"Too many backend redirects.\"}"};
        }

'''
java = java[:start] + replacement + java[end:]

# Make the existing fallback login use the same native secureLogin path rather than
# cloudRequest/appHttpResult, eliminating the separate non-JSON login parser.
old_call = "window.AndroidBridge.cloudRequest('POST',window.AndroidBridge.getSharedApiUrl(),JSON.stringify({action:'login',username:m,password:p}));"
if old_call in java:
    java = java.replace(old_call, "window.AndroidBridge.secureLogin(m,p);", 1)

java_path.write_text(java, encoding="utf-8")
print("network/login transport patch applied")
