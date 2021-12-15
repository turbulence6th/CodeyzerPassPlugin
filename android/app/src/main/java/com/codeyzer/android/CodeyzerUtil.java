package com.codeyzer.android;

import android.os.Build;
import android.webkit.WebView;

import androidx.annotation.RequiresApi;

import com.getcapacitor.Bridge;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.concurrent.CompletableFuture;

public class CodeyzerUtil {

    @RequiresApi(api = Build.VERSION_CODES.N)
    public static String desifreEt(WebView webView, String sifreliMetin, String sifre) {
       try {
           CompletableFuture<String> future = new CompletableFuture<>();
           webView.evaluateJavascript(String.format("hex2a(CryptoJS.AES.decrypt('%s', '%s').toString())", sifreliMetin, sifre), x -> future.complete(x));
           return future.get();
       } catch (Exception e) {
           return null;
       }
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    public static String inputStream2String(InputStream is) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(is));
        StringBuilder stringBuilder = new StringBuilder();

        String line;
        while ((line = br.readLine()) != null) {
            stringBuilder.append(line);
            stringBuilder.append("\n");
        }

        return stringBuilder.toString();
    }
}
