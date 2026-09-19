package com.mahindra.bsvi;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

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
    private static final String API_URL = "https://script.google.com/macros/s/AKfycbyaf4CxW_aGMwJIDoK4Moo6rY0S-YFv2cknA1mqTb7czweU_OPgYJTSX_a0igKNSlpE/exec";
    private static final int REQ_AUDIO = 3001;
    private static final int REQ_CAMERA = 3002;
    private static final int REQ_FILE = 3003;

    private WebView web;
    private SpeechRecognizer speechRecognizer;
    private ValueCallback<Uri[]> fileCallback;
    private Uri cameraUri;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        setContentView(web);
        configureWebView();
        web.loadUrl("file:///android_asset/index.html");
    }

    private void configureWebView() {
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(true);
        web.getSettings().setAllowContentAccess(true);
        web.getSettings().setMediaPlaybackRequiresUserGesture(false);
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                openCameraForFileChooser();
                return true;
            }
        });
        web.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");
    }

    private void openCameraForFileChooser() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, REQ_CAMERA);
            return;
        }
        try {
            File dir = new File(getCacheDir(), "camera");
            if (!dir.exists()) dir.mkdirs();
            String stamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(new Date());
            File photo = new File(dir, "MAHINDRA_" + stamp + ".jpg");
            cameraUri = FileProvider.getUriForFile(this, "com.mahindra.bsvi.driverguide.fileprovider", photo);
            Intent i = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            i.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri);
            i.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            startActivityForResult(i, REQ_FILE);
        } catch (Exception e) {
            if (fileCallback != null) { fileCallback.onReceiveValue(null); fileCallback = null; }
            Toast.makeText(this, "Camera could not be opened", Toast.LENGTH_SHORT).show();
        }
    }

    public class AndroidBridge {
        @JavascriptInterface public String getSharedApiUrl() { return API_URL; }

        @JavascriptInterface public void cloudRequest(String method, String url, String body) {
            new Thread(() -> {
                int code = 0;
                String response;
                try {
                    HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
                    c.setRequestMethod(method == null ? "GET" : method.toUpperCase(Locale.US));
                    c.setConnectTimeout(20000);
                    c.setReadTimeout(30000);
                    c.setInstanceFollowRedirects(true);
                    c.setRequestProperty("Accept", "application/json");
                    if ("POST".equalsIgnoreCase(method)) {
                        c.setDoOutput(true);
                        c.setRequestProperty("Content-Type", "text/plain; charset=utf-8");
                        byte[] data = (body == null ? "" : body).getBytes(StandardCharsets.UTF_8);
                        try (OutputStream os = c.getOutputStream()) { os.write(data); }
                    }
                    code = c.getResponseCode();
                    BufferedReader br = new BufferedReader(new InputStreamReader(
                            code >= 400 ? c.getErrorStream() : c.getInputStream(), StandardCharsets.UTF_8));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) sb.append(line);
                    br.close();
                    response = sb.toString();
                    c.disconnect();
                } catch (Exception e) {
                    response = "{\"ok\":false,\"code\":0,\"error\":\"Network error: " +
                            escapeJson(e.getMessage()) + "\"}";
                }
                final int resultCode = code;
                final String resultBody = response;
                web.post(() -> {
                    String payload = "{\"code\":" + resultCode + ",\"body\":" + JSONObject.quote(resultBody) + "}";
                    web.evaluateJavascript("window.appHttpResult && window.appHttpResult(" + JSONObject.quote(payload) + ")", null);
                });
            }).start();
        }

        @JavascriptInterface public void startSpeech(String locale) {
            runOnUiThread(() -> startNativeSpeech(locale));
        }

        @JavascriptInterface public void openExternalUrl(String url) {
            try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); }
            catch (Exception e) { Toast.makeText(MainActivity.this, "Cannot open link", Toast.LENGTH_SHORT).show(); }
        }

        @JavascriptInterface public void openCamera() {
            runOnUiThread(() -> {
                if (fileCallback == null) {
                    Toast.makeText(MainActivity.this, "Use the Take Photo button", Toast.LENGTH_SHORT).show();
                } else openCameraForFileChooser();
            });
        }

        @JavascriptInterface public void saveTextFile(String filename, String content) {
            runOnUiThread(() -> {
                Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                i.setType("text/csv");
                i.putExtra(Intent.EXTRA_TITLE, filename);
                pendingSaveContent = content == null ? "" : content;
                startActivityForResult(i, REQ_FILE + 10);
            });
        }
    }

    private String pendingSaveContent = "";

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ").replace("\r", " ");
    }

    private void startNativeSpeech(String locale) {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, REQ_AUDIO);
            return;
        }
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            sendSpeechError("Speech recognition is not available on this phone.");
            return;
        }
        if (speechRecognizer != null) speechRecognizer.destroy();
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
        speechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override public void onReadyForSpeech(Bundle params) {}
            @Override public void onBeginningOfSpeech() {}
            @Override public void onRmsChanged(float rmsdB) {}
            @Override public void onBufferReceived(byte[] buffer) {}
            @Override public void onEndOfSpeech() {}
            @Override public void onError(int error) { sendSpeechError("Voice recognition error (" + error + "). Please try again."); }
            @Override public void onResults(Bundle results) {
                ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                sendSpeechResult(matches != null && !matches.isEmpty() ? matches.get(0) : "");
            }
            @Override public void onPartialResults(Bundle partialResults) {}
            @Override public void onEvent(int eventType, Bundle params) {}
        });
        Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, locale == null ? "en-IN" : locale);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, locale == null ? "en-IN" : locale);
        i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3);
        speechRecognizer.startListening(i);
    }

    private void sendSpeechResult(String text) {
        if (web != null) web.post(() -> web.evaluateJavascript("window.nativeSpeechResult && window.nativeSpeechResult(" + JSONObject.quote(text == null ? "" : text) + ")", null));
    }

    private void sendSpeechError(String msg) {
        if (web != null) web.post(() -> web.evaluateJavascript("window.nativeSpeechError && window.nativeSpeechError(" + JSONObject.quote(msg) + ")", null));
    }

    @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_AUDIO) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) startNativeSpeech("en-IN");
            else sendSpeechError("Microphone permission was denied. Allow Microphone for Mahindra BSVI Driver Guide AI.");
        } else if (requestCode == REQ_CAMERA) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) openCameraForFileChooser();
            else if (fileCallback != null) { fileCallback.onReceiveValue(null); fileCallback = null; }
        }
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_FILE) {
            if (fileCallback != null) {
                Uri[] result = (resultCode == RESULT_OK && cameraUri != null) ? new Uri[]{cameraUri} : null;
                fileCallback.onReceiveValue(result);
                fileCallback = null;
            }
            return;
        }
        if (requestCode == REQ_FILE + 10 && resultCode == RESULT_OK && data != null && data.getData() != null) {
            try (OutputStream os = getContentResolver().openOutputStream(data.getData())) {
                if (os != null) os.write(pendingSaveContent.getBytes(StandardCharsets.UTF_8));
                Toast.makeText(this, "File saved", Toast.LENGTH_SHORT).show();
            } catch (Exception e) { Toast.makeText(this, "Could not save file", Toast.LENGTH_SHORT).show(); }
        }
    }

    @Override protected void onDestroy() {
        if (speechRecognizer != null) speechRecognizer.destroy();
        super.onDestroy();
    }

    @Override public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack(); else super.onBackPressed();
    }
}
