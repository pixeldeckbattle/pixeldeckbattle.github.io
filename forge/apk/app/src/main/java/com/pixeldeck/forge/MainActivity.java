package com.pixeldeck.forge;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import java.io.InputStream;

import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

/** PixelDeck Forge: the whole app is the page in assets/www; this activity hosts it and gives it files, saving and copy. */
public class MainActivity extends Activity {
    private static final int REQ_FILE = 7;
    private static final String HOST = "studio.pixeldeck.app";

    private static String mime(String p) {
        String l = p.toLowerCase();
        if (l.endsWith(".html")) return "text/html";
        if (l.endsWith(".js")) return "application/javascript";
        if (l.endsWith(".json")) return "application/json";
        if (l.endsWith(".css")) return "text/css";
        if (l.endsWith(".png")) return "image/png";
        if (l.endsWith(".jpg") || l.endsWith(".jpeg")) return "image/jpeg";
        if (l.endsWith(".webp")) return "image/webp";
        if (l.endsWith(".gif")) return "image/gif";
        if (l.endsWith(".svg")) return "image/svg+xml";
        if (l.endsWith(".ttf")) return "font/ttf";
        if (l.endsWith(".woff")) return "font/woff";
        if (l.endsWith(".woff2")) return "font/woff2";
        return "application/octet-stream";
    }
    private static final String FOLDER = Environment.DIRECTORY_DOWNLOADS + "/PixelDeckForge";
    private WebView web;
    private ValueCallback<Uri[]> fileCb;
    private final Map<String, OutputStream> outs = new HashMap<>();
    private final Map<String, Uri> uris = new HashMap<>();
    private final Map<String, String> mimes = new HashMap<>();
    private int seq = 0;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        web = new WebView(this);
        web.setBackgroundColor(0xFF14111F);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setMediaPlaybackRequiresUserGesture(true);
        s.setTextZoom(100);
        web.addJavascriptInterface(new Bridge(), "Android");
        // the app's pages are served from assets/www under a private https origin, so canvases stay readable (export PNG/ZIP)
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if (!HOST.equals(u.getHost())) return null;
                String path = u.getPath();
                if (path == null || path.equals("/")) path = "/index.html";
                try {
                    InputStream in = getAssets().open("www" + Uri.decode(path));
                    WebResourceResponse res = new WebResourceResponse(mime(path), null, in);
                    Map<String, String> h = new HashMap<>();
                    h.put("Access-Control-Allow-Origin", "*");
                    h.put("Cache-Control", "no-cache");
                    res.setResponseHeaders(h);
                    return res;
                } catch (Exception e) {
                    return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found", new HashMap<String, String>(), null);
                }
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (fileCb != null) fileCb.onReceiveValue(null);
                fileCb = cb;
                boolean images = true;
                for (String a : p.getAcceptTypes()) if (a != null && !a.isEmpty() && !a.startsWith("image/")) images = false;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType(images ? "image/*" : "*/*");
                if (p.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                try {
                    startActivityForResult(Intent.createChooser(i, "เลือกไฟล์"), REQ_FILE);
                } catch (Exception e) {
                    fileCb = null;
                    return false;
                }
                return true;
            }
        });
        if (saved != null) web.restoreState(saved);
        else web.loadUrl("https://" + HOST + "/index.html");
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        if (req != REQ_FILE || fileCb == null) {
            super.onActivityResult(req, res, data);
            return;
        }
        Uri[] list = null;
        if (res == RESULT_OK && data != null) {
            ClipData cd = data.getClipData();
            if (cd != null && cd.getItemCount() > 0) {
                list = new Uri[cd.getItemCount()];
                for (int k = 0; k < list.length; k++) list[k] = cd.getItemAt(k).getUri();
            } else if (data.getData() != null) {
                list = new Uri[]{data.getData()};
            }
        }
        fileCb.onReceiveValue(list);
        fileCb = null;
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    /** Called from the page as window.Android.* (on a background thread). */
    private class Bridge {
        @JavascriptInterface
        public synchronized String begin(String name, String mime) {
            try {
                ContentValues v = new ContentValues();
                v.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
                v.put(MediaStore.MediaColumns.MIME_TYPE, mime);
                v.put(MediaStore.MediaColumns.RELATIVE_PATH, FOLDER);
                Uri u = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                if (u == null) return "";
                OutputStream o = getContentResolver().openOutputStream(u);
                if (o == null) return "";
                String id = String.valueOf(++seq);
                outs.put(id, o);
                uris.put(id, u);
                mimes.put(id, mime);
                return id;
            } catch (Exception e) {
                return "";
            }
        }

        @JavascriptInterface
        public synchronized boolean chunk(String id, String b64) {
            OutputStream o = outs.get(id);
            if (o == null) return false;
            try {
                o.write(Base64.decode(b64, Base64.DEFAULT));
                return true;
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public synchronized String end(String id) {
            OutputStream o = outs.remove(id);
            Uri u = uris.get(id);
            if (o == null || u == null) return "";
            try {
                o.close();
            } catch (Exception e) {
                return "";
            }
            String name = "";
            try (Cursor c = getContentResolver().query(u, new String[]{MediaStore.MediaColumns.DISPLAY_NAME}, null, null, null)) {
                if (c != null && c.moveToFirst()) name = c.getString(0);
            } catch (Exception ignored) {
            }
            return name == null || name.isEmpty() ? "file" : name;
        }

        @JavascriptInterface
        public void share(String id) {
            final Uri u = uris.get(id);
            final String m = mimes.get(id);
            if (u == null) return;
            runOnUiThread(() -> {
                Intent s = new Intent(Intent.ACTION_SEND);
                s.setType(m == null ? "*/*" : m);
                s.putExtra(Intent.EXTRA_STREAM, u);
                s.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                startActivity(Intent.createChooser(s, "แชร์ไฟล์"));
            });
        }

        @JavascriptInterface
        public boolean copy(final String text) {
            runOnUiThread(() -> {
                ClipboardManager cm = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
                if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("PixelDeck Forge", text));
            });
            return true;
        }
    }
}
