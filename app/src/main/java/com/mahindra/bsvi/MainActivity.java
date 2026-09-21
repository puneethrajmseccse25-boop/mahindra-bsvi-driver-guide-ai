package com.mahindra.bsvi;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends Activity {

    private static final String API_URL =
            "https://script.google.com/macros/s/AKfycbyaf4CxW_aGMwJIDoK4Moo6rY0S-YFv2cknA1mqTb7czweU_OPgYJTSX_a0igKNSlpE/exec";

    private static final int REQ_AUDIO = 3001;
    private static final int REQ_CAMERA = 3002;
    private static final int REQ_FILE = 3003;
    private static final int REQ_DIRECT_CAMERA = 3004;

    private WebView web;
    private SpeechRecognizer speechRecognizer;
    private TextToSpeech textToSpeech;
    private ValueCallback<Uri[]> fileCallback;
    private Uri cameraUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        web = new WebView(this);
        setContentView(web);

        configureWebView();
        textToSpeech = new TextToSpeech(this, status -> { });

        web.loadUrl("file:///android_asset/index.html");
    }

    private void configureWebView() {

        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(true);
        web.getSettings().setAllowContentAccess(true);
        web.getSettings().setMediaPlaybackRequiresUserGesture(false);

        web.setWebViewClient(new WebViewClient() {

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);

                // Normalize Apps Script responses before the existing HTML parser sees them.
                view.evaluateJavascript(
                        "(function(){window.__mahindraNormalizeResponse=function(raw){"
                                + "try{"
                                + "var o=(typeof raw==='string')?JSON.parse(raw):raw;"
                                + "var b=o&&o.body;"
                                + "if(typeof b==='string'){"
                                + "var hm=b.match(/id=[\"']mahindra-json[\"'][^>]*>([^<]+)</i);"
                                + "if(hm&&hm[1]){"
                                + "var hs=hm[1].trim().replace(/-/g,'+').replace(/_/g,'/');while(hs.length%4)hs+='=';"
                                + "try{var hb=atob(hs),hbytes=new Uint8Array(hb.length);for(var hi=0;hi<hb.length;hi++)hbytes[hi]=hb.charCodeAt(hi);var hdec=new TextDecoder('utf-8').decode(hbytes);JSON.parse(hdec);return JSON.stringify({code:o.code||200,body:hdec});}catch(he){}"
                                + "}"
                                + "}"
                                + "if(typeof b==='string'){"
                                + "try{JSON.parse(b||'{}');return raw;}"
                                + "catch(e){"
                                + "var m=b.match(/<meta[^>]+name=[\\\"']mahindra-json[\\\"'][^>]+content=[\\\"']([^\\\"']+)[\\\"'][^>]*>/i);"
                                + "if(m&&m[1]){"
                                + "var s=m[1].replace(/-/g,'+').replace(/_/g,'/');"
                                + "while(s.length%4)s+='=';"
                                + "var bin=atob(s),bytes=new Uint8Array(bin.length);"
                                + "for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);"
                                + "var decoded=new TextDecoder('utf-8').decode(bytes);"
                                + "JSON.parse(decoded);"
                                + "return JSON.stringify({code:o.code||200,body:decoded});"
                                + "}"
                                + "var a=b.indexOf('{'),z=b.lastIndexOf('}');"
                                + "if(a>=0&&z>a){var candidate=b.slice(a,z+1);try{JSON.parse(candidate);return JSON.stringify({code:o.code||200,body:candidate});}catch(e){}}"
                                + "var err={ok:false,code:(o&&o.code)||0,error:'Backend returned non-JSON response (HTTP '+((o&&o.code)||0)+').',details:b.slice(0,800)};"
                                + "return JSON.stringify({code:(o&&o.code)||0,body:JSON.stringify(err)});"
                                + "}"
                                + "}"
                                + "return raw;"
                                + "}catch(e){"
                                + "var err={ok:false,code:0,error:'Backend response error: '+(e.message||e),details:String(raw).slice(0,800)};"
                                + "return JSON.stringify({code:0,body:JSON.stringify(err)});"
                                + "}};})();",
                        null
                );

                // Every fresh Activity launch starts unauthenticated.
                view.evaluateJavascript(
                        "(function(){try{localStorage.removeItem('mahindra_secure_token_v1');localStorage.removeItem('mahindra_secure_user_v1');localStorage.removeItem('mahindra_user_role_v2');}catch(e){};var s=document.createElement('script');s.src='file:///android_asset/app_shell.js';document.head.appendChild(s);})();",
                        null
                );
            }

            @Override
            public boolean shouldOverrideUrlLoading(
                    WebView view,
                    WebResourceRequest request) {

                return false;
            }
        });

        web.setWebChromeClient(new WebChromeClient() {

            @Override
            public boolean onShowFileChooser(
                    WebView view,
                    ValueCallback<Uri[]> callback,
                    FileChooserParams params) {

                if (fileCallback != null) {
                    fileCallback.onReceiveValue(null);
                }

                fileCallback = callback;

                openCameraForFileChooser();

                return true;
            }
        });

        web.addJavascriptInterface(
                new AndroidBridge(),
                "AndroidBridge"
        );
    }

    private void openDirectCamera() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.CAMERA},
                    REQ_DIRECT_CAMERA
            );
            return;
        }

        try {
            File dir = new File(getCacheDir(), "camera");
            if (!dir.exists()) dir.mkdirs();

            String stamp = new SimpleDateFormat(
                    "yyyyMMdd_HHmmss",
                    Locale.US
            ).format(new Date());

            File photo = new File(
                    dir,
                    "MAHINDRA_DRIVER_" + stamp + ".jpg"
            );

            cameraUri = FileProvider.getUriForFile(
                    this,
                    "com.mahindra.bsvi.driverguide.fileprovider",
                    photo
            );

            Intent i = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            i.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri);
            i.addFlags(
                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                            | Intent.FLAG_GRANT_READ_URI_PERMISSION
            );

            if (i.resolveActivity(getPackageManager()) == null) {
                sendCameraResult(false);
                Toast.makeText(
                        this,
                        "No camera application is available",
                        Toast.LENGTH_SHORT
                ).show();
                return;
            }

            startActivityForResult(i, REQ_DIRECT_CAMERA);
        } catch (Exception e) {
            sendCameraResult(false);
            Toast.makeText(
                    this,
                    "Camera could not be opened",
                    Toast.LENGTH_SHORT
            ).show();
        }
    }

    private void sendCameraResult(boolean ok) {
        if (web != null) {
            web.post(() -> web.evaluateJavascript(
                    "window.nativeCameraResult && window.nativeCameraResult(" +
                            (ok ? "true" : "false") + ")",
                    null
            ));
        }
    }

    private void openCameraForFileChooser() {

        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.CAMERA
        ) != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.CAMERA},
                    REQ_CAMERA
            );

            return;
        }

        try {

            File dir = new File(
                    getCacheDir(),
                    "camera"
            );

            if (!dir.exists()) {
                dir.mkdirs();
            }

            String stamp =
                    new SimpleDateFormat(
                            "yyyyMMdd_HHmmss",
                            Locale.US
                    ).format(new Date());

            File photo = new File(
                    dir,
                    "MAHINDRA_" + stamp + ".jpg"
            );

            cameraUri = FileProvider.getUriForFile(
                    this,
                    "com.mahindra.bsvi.driverguide.fileprovider",
                    photo
            );

            Intent i =
                    new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

            i.putExtra(
                    MediaStore.EXTRA_OUTPUT,
                    cameraUri
            );

            i.addFlags(
                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                            | Intent.FLAG_GRANT_READ_URI_PERMISSION
            );

            startActivityForResult(
                    i,
                    REQ_FILE
            );

        } catch (Exception e) {

            if (fileCallback != null) {
                fileCallback.onReceiveValue(null);
                fileCallback = null;
            }

            Toast.makeText(
                    this,
                    "Camera could not be opened",
                    Toast.LENGTH_SHORT
            ).show();
        }
    }

    public class AndroidBridge {

        @JavascriptInterface
        public String getSharedApiUrl() {
            return API_URL;
        }

        @JavascriptInterface
        public void cloudRequest(
                String method,
                String url,
                String body
        ) {
            new Thread(() -> {
                int code = 0;
                String response = "";

                try {
                    String currentUrl = url;
                    String requestMethod = method == null
                            ? "GET"
                            : method.toUpperCase(Locale.US);

                    byte[] data = (body == null ? "" : body)
                            .getBytes(StandardCharsets.UTF_8);

                    /*
                     * Google Apps Script ContentService uses a redirect/session
                     * flow. The important rules are:
                     * 1. Send the original login as POST to the /exec URL.
                     * 2. Apps Script executes doPost(), then redirects the
                     *    response to a one-time googleusercontent.com URL.
                     * 3. Fetch that one-time response URL with GET. Sending
                     *    POST again to googleusercontent.com causes HTTP 405.
                     * 4. Preserve the Google session cookie between hops.
                     */
                    String cookie = null;

                    for (int redirect = 0; redirect < 8; redirect++) {
                        HttpURLConnection c =
                                (HttpURLConnection) new URL(currentUrl).openConnection();

                        c.setRequestMethod(requestMethod);
                        c.setConnectTimeout(20000);
                        c.setReadTimeout(30000);
                        c.setInstanceFollowRedirects(false);

                        c.setRequestProperty(
                                "Accept",
                                "application/json, text/plain, */*"
                        );
                        c.setRequestProperty(
                                "User-Agent",
                                "MahindraBSVI-DriverGuideAI/1.0"
                        );
                        c.setRequestProperty("Accept-Encoding", "identity");

                        if (cookie != null && !cookie.isEmpty()) {
                            c.setRequestProperty("Cookie", cookie);
                        }

                        if ("POST".equals(requestMethod)) {
                            c.setDoOutput(true);
                            c.setRequestProperty(
                                    "Content-Type",
                                    "application/json; charset=utf-8"
                            );
                            c.setFixedLengthStreamingMode(data.length);

                            try (OutputStream os = c.getOutputStream()) {
                                os.write(data);
                                os.flush();
                            }
                        }

                        code = c.getResponseCode();

                        /*
                         * Keep Google's session cookie. In particular this is
                         * normally the S cookie used for Apps Script sessions.
                         */
                        java.util.Map<String, java.util.List<String>> headers = c.getHeaderFields();
                        if (headers != null) {
                            // Header-name casing is not guaranteed by HttpURLConnection.
                            // Read Set-Cookie case-insensitively so the Apps Script S
                            // session cookie is never lost between redirect hops.
                            for (java.util.Map.Entry<String, java.util.List<String>> entry : headers.entrySet()) {
                                String headerName = entry.getKey();
                                if (headerName != null && "Set-Cookie".equalsIgnoreCase(headerName)) {
                                    java.util.List<String> cookies = entry.getValue();
                                    if (cookies != null) {
                                        for (String setCookie : cookies) {
                                            if (setCookie != null && !setCookie.trim().isEmpty()) {
                                                cookie = mergeCookie(cookie, extractCookiePair(setCookie));
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        String location = c.getHeaderField("X-Redirect-Location");
                        if (location == null || location.trim().isEmpty()) {
                            location = c.getHeaderField("Location");
                        }

                        /*
                         * Apps Script executes the POST at /exec, then returns
                         * a redirect to a one-time googleusercontent.com URL.
                         * That second URL is read with GET. Repeating the POST
                         * there is what produces HTTP 405.
                         */
                        if (code == 412
                                || code == HttpURLConnection.HTTP_MOVED_PERM
                                || code == HttpURLConnection.HTTP_MOVED_TEMP
                                || code == HttpURLConnection.HTTP_SEE_OTHER) {

                            c.disconnect();

                            if (location == null || location.trim().isEmpty()) {
                                response =
                                        "{\"ok\":false,\"code\":"
                                                + code
                                                + ",\"error\":\"Backend redirect did not provide a redirect URL.\"}";
                                break;
                            }

                            currentUrl = new URL(
                                    new URL(currentUrl),
                                    location
                            ).toString();

                            // The Apps Script one-time response endpoint is GET-only.
                            // The original POST has already executed on /exec.
                            requestMethod = "GET";
                            data = new byte[0];
                            continue;
                        }

                        if (code == 307 || code == 308) {
                            c.disconnect();

                            if (location == null || location.trim().isEmpty()) {
                                response =
                                        "{\"ok\":false,\"code\":"
                                                + code
                                                + ",\"error\":\"Backend redirect did not provide a redirect URL.\"}";
                                break;
                            }

                            currentUrl = new URL(
                                    new URL(currentUrl),
                                    location
                            ).toString();
                            continue;
                        }

                        InputStreamReader reader =
                                new InputStreamReader(
                                        code >= 400
                                                ? c.getErrorStream()
                                                : c.getInputStream(),
                                        StandardCharsets.UTF_8
                                );

                        BufferedReader br = new BufferedReader(reader);
                        StringBuilder sb = new StringBuilder();
                        String line;

                        while ((line = br.readLine()) != null) {
                            sb.append(line);
                        }

                        br.close();
                        response = sb.toString();
                        c.disconnect();
                        break;
                    }

                    if (response == null || response.trim().isEmpty()) {
                        response =
                                "{\"ok\":false,\"code\":"
                                        + code
                                        + ",\"error\":\"Backend returned an empty response.\"}";
                    }

                } catch (Exception e) {
                    response =
                            "{\"ok\":false,\"code\":0,\"error\":\"Network error: "
                                    + escapeJson(e.getMessage())
                                    + "\"}";
                }

                final int resultCode = code;
                final String resultBody = response;

                web.post(() -> {
                    String payload =
                            "{\"code\":"
                                    + resultCode
                                    + ",\"body\":"
                                    + JSONObject.quote(resultBody)
                                    + "}";

                    web.evaluateJavascript(
                            "window.appHttpResult && window.appHttpResult(window.__mahindraNormalizeResponse("
                                    + JSONObject.quote(payload)
                                    + "))",
                            null
                    );
                });
            }).start();
        }

        private String extractCookiePair(String setCookie) {
            int semicolon = setCookie.indexOf(';');
            String pair = semicolon >= 0
                    ? setCookie.substring(0, semicolon)
                    : setCookie;
            return pair.trim();
        }

        private String mergeCookie(String existing, String next) {
            if (existing == null || existing.trim().isEmpty()) return next;
            if (next == null || next.trim().isEmpty()) return existing;
            String name = next.split("=", 2)[0].trim();
            String[] parts = existing.split(";");
            StringBuilder out = new StringBuilder();
            boolean replaced = false;
            for (String part : parts) {
                String p = part.trim();
                if (p.isEmpty()) continue;
                if (out.length() > 0) out.append("; ");
                if (p.startsWith(name + "=")) { out.append(next); replaced = true; }
                else out.append(p);
            }
            if (!replaced) { if (out.length() > 0) out.append("; "); out.append(next); }
            return out.toString();
        }

        @JavascriptInterface
        public void speakText(String text, String locale) {
            runOnUiThread(() -> {
                try {
                    if (textToSpeech == null) textToSpeech = new TextToSpeech(MainActivity.this, status -> {});
                    int status = textToSpeech.setLanguage(new Locale(
                            locale != null && locale.startsWith("hi") ? "hi" :
                            locale != null && locale.startsWith("kn") ? "kn" : "en", "IN"));
                    if (status == TextToSpeech.LANG_MISSING_DATA || status == TextToSpeech.LANG_NOT_SUPPORTED) {
                        sendSpeechError("Text-to-speech language is not available.");
                        return;
                    }
                    textToSpeech.speak(text == null ? "" : text, TextToSpeech.QUEUE_FLUSH, null, "mahindra_read_steps");
                } catch (Exception e) {
                    sendSpeechError("Text-to-speech could not start.");
                }
            });
        }

        @JavascriptInterface
        public void startSpeech(String locale) {

            runOnUiThread(() ->
                    startNativeSpeech(locale)
            );
        }

        @JavascriptInterface
        public void openExternalUrl(String url) {

            try {

                startActivity(
                        new Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse(url)
                        )
                );

            } catch (Exception e) {

                Toast.makeText(
                        MainActivity.this,
                        "Cannot open link",
                        Toast.LENGTH_SHORT
                ).show();
            }
        }

        @JavascriptInterface
        public void captureDriverPhoto() {
            runOnUiThread(() -> openDirectCamera());
        }

        @JavascriptInterface
        public void openCamera() {

            runOnUiThread(() -> {

                if (fileCallback == null) {

                    Toast.makeText(
                            MainActivity.this,
                            "Use the Take Photo button",
                            Toast.LENGTH_SHORT
                    ).show();

                } else {

                    openCameraForFileChooser();
                }
            });
        }

        @JavascriptInterface
        public void saveTextFile(
                String filename,
                String content
        ) {

            runOnUiThread(() -> {

                Intent i =
                        new Intent(
                                Intent.ACTION_CREATE_DOCUMENT
                        );

                i.setType("text/csv");

                i.putExtra(
                        Intent.EXTRA_TITLE,
                        filename
                );

                pendingSaveContent =
                        content == null
                                ? ""
                                : content;

                startActivityForResult(
                        i,
                        REQ_FILE + 10
                );
            });
        }
    }

    private String pendingSaveContent = "";

    private static String escapeJson(String s) {

        if (s == null) {
            return "";
        }

        return s
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", " ")
                .replace("\r", " ");
    }

    private void startNativeSpeech(String locale) {

        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.RECORD_AUDIO
        ) != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.RECORD_AUDIO},
                    REQ_AUDIO
            );

            return;
        }

        if (!SpeechRecognizer.isRecognitionAvailable(this)) {

            sendSpeechError(
                    "Speech recognition is not available on this phone."
            );

            return;
        }

        if (speechRecognizer != null) {
            speechRecognizer.destroy();
        }
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
        }

        speechRecognizer =
                SpeechRecognizer.createSpeechRecognizer(this);

        speechRecognizer.setRecognitionListener(
                new RecognitionListener() {

                    @Override
                    public void onReadyForSpeech(
                            Bundle params) {
                    }

                    @Override
                    public void onBeginningOfSpeech() {
                    }

                    @Override
                    public void onRmsChanged(
                            float rmsdB) {
                    }

                    @Override
                    public void onBufferReceived(
                            byte[] buffer) {
                    }

                    @Override
                    public void onEndOfSpeech() {
                    }

                    @Override
                    public void onError(
                            int error) {

                        sendSpeechError(
                                "Voice recognition error ("
                                        + error
                                        + "). Please try again."
                        );
                    }

                    @Override
                    public void onResults(
                            Bundle results) {

                        ArrayList<String> matches =
                                results.getStringArrayList(
                                        SpeechRecognizer.RESULTS_RECOGNITION
                                );

                        sendSpeechResult(
                                matches != null
                                        && !matches.isEmpty()
                                        ? matches.get(0)
                                        : ""
                        );
                    }

                    @Override
                    public void onPartialResults(
                            Bundle partialResults) {
                    }

                    @Override
                    public void onEvent(
                            int eventType,
                            Bundle params) {
                    }
                }
        );

        Intent i =
                new Intent(
                        RecognizerIntent.ACTION_RECOGNIZE_SPEECH
                );

        i.putExtra(
                RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM
        );

        i.putExtra(
                RecognizerIntent.EXTRA_LANGUAGE,
                locale == null
                        ? "en-IN"
                        : locale
        );

        i.putExtra(
                RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE,
                locale == null
                        ? "en-IN"
                        : locale
        );

        i.putExtra(
                RecognizerIntent.EXTRA_MAX_RESULTS,
                3
        );

        speechRecognizer.startListening(i);
    }

    private void analyzeDriverPhoto() {
        if (cameraUri == null || web == null) {
            sendPhotoOcrResult("");
            return;
        }

        try {
            InputImage image = InputImage.fromFilePath(this, cameraUri);
            TextRecognizer recognizer =
                    TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);

            recognizer.process(image)
                    .addOnSuccessListener(result -> {
                        sendPhotoOcrResult(result.getText());
                        recognizer.close();
                    })
                    .addOnFailureListener(error -> {
                        sendPhotoOcrResult("");
                        recognizer.close();
                    });
        } catch (Exception e) {
            sendPhotoOcrResult("");
        }
    }

    private void sendPhotoOcrResult(String text) {
        if (web != null) {
            web.post(() ->
                    web.evaluateJavascript(
                            "window.nativePhotoTextResult && window.nativePhotoTextResult("
                                    + JSONObject.quote(text == null ? "" : text)
                                    + ")",
                            null
                    )
            );
        }
    }

    private void sendSpeechResult(String text) {

        if (web != null) {

            web.post(() ->
                    web.evaluateJavascript(
                            "window.nativeSpeechResult && window.nativeSpeechResult("
                                    + JSONObject.quote(
                                    text == null
                                            ? ""
                                            : text
                            )
                                    + ")",
                            null
                    )
            );
        }
    }

    private void sendSpeechError(String msg) {

        if (web != null) {

            web.post(() ->
                    web.evaluateJavascript(
                            "window.nativeSpeechError && window.nativeSpeechError("
                                    + JSONObject.quote(msg)
                                    + ")",
                            null
                    )
            );
        }
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            String[] permissions,
            int[] grantResults
    ) {

        super.onRequestPermissionsResult(
                requestCode,
                permissions,
                grantResults
        );

        if (requestCode == REQ_AUDIO) {

            if (grantResults.length > 0
                    && grantResults[0]
                    == PackageManager.PERMISSION_GRANTED) {

                startNativeSpeech("en-IN");

            } else {

                sendSpeechError(
                        "Microphone permission was denied. Allow Microphone for Mahindra BSVI Driver Guide AI."
                );
            }

        } else if (requestCode == REQ_DIRECT_CAMERA) {

            if (grantResults.length > 0
                    && grantResults[0] == PackageManager.PERMISSION_GRANTED) {

                openDirectCamera();

            } else {

                sendCameraResult(false);
            }

        } else if (requestCode == REQ_CAMERA) {

            if (grantResults.length > 0
                    && grantResults[0]
                    == PackageManager.PERMISSION_GRANTED) {

                openCameraForFileChooser();

            } else if (fileCallback != null) {

                fileCallback.onReceiveValue(null);

                fileCallback = null;
            }
        }
    }

    @Override
    protected void onActivityResult(
            int requestCode,
            int resultCode,
            Intent data
    ) {

        super.onActivityResult(
                requestCode,
                resultCode,
                data
        );

        if (requestCode == REQ_DIRECT_CAMERA) {

            boolean ok = resultCode == RESULT_OK && cameraUri != null;
            sendCameraResult(ok);
            if (ok) {
                analyzeDriverPhoto();
            }

            return;
        }

        if (requestCode == REQ_FILE) {

            if (fileCallback != null) {

                Uri[] result =
                        (resultCode == RESULT_OK
                                && cameraUri != null)
                                ? new Uri[]{cameraUri}
                                : null;

                fileCallback.onReceiveValue(result);

                fileCallback = null;
            }

            return;
        }

        if (requestCode == REQ_FILE + 10
                && resultCode == RESULT_OK
                && data != null
                && data.getData() != null) {

            try (
                    OutputStream os =
                            getContentResolver()
                                    .openOutputStream(
                                            data.getData()
                                    )
            ) {

                if (os != null) {

                    os.write(
                            pendingSaveContent
                                    .getBytes(
                                            StandardCharsets.UTF_8
                                    )
                    );
                }

                Toast.makeText(
                        this,
                        "File saved",
                        Toast.LENGTH_SHORT
                ).show();

            } catch (Exception e) {

                Toast.makeText(
                        this,
                        "Could not save file",
                        Toast.LENGTH_SHORT
                ).show();
            }
        }
    }

    @Override
    protected void onDestroy() {

        if (speechRecognizer != null) {
            speechRecognizer.destroy();
        }

        super.onDestroy();
    }

    @Override
    public void onBackPressed() {

        if (web != null
                && web.canGoBack()) {

            web.goBack();

        } else {

            super.onBackPressed();
        }
    }
}
