package com.codeyzer.android;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@CapacitorPlugin(name = "CodeyzerAutofillPlugin")
public class CodeyzerAutofillPlugin extends Plugin {

    @RequiresApi(api = Build.VERSION_CODES.O)
    @PluginMethod
    public void sifreListesiEkle(PluginCall call) throws Exception {
        List<HariciSifreDesifre> hariciSifreListesi = new ObjectMapper().readValue(call.getArray("hariciSifreListesi").toString(),
                new TypeReference<List<HariciSifreDesifre>>() {});

        SharedPreferences sharedPreferences = getContext().getSharedPreferences("hariciSifreListesi", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("hariciSifreListesi", new ObjectMapper().writeValueAsString(hariciSifreListesi));
        editor.apply();

        call.resolve();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @PluginMethod
    public void androidPaketGetir(PluginCall call) throws JsonProcessingException, JSONException {
        PackageManager packageManager = getActivity().getPackageManager();
        List<PaketOption> paketList = packageManager.getInstalledApplications(PackageManager.GET_META_DATA).stream()
                .filter(x ->  (x.flags & ApplicationInfo.FLAG_SYSTEM) == 0)
                .map(x -> {
                    PaketOption paketOption = new PaketOption();
                    paketOption.setText((String) packageManager.getApplicationLabel(x));
                    paketOption.setValue(x.packageName);
                    return paketOption;
                })
                .sorted(Comparator.comparing(PaketOption::getText))
                .collect(Collectors.toList());

        JSObject ret = new JSObject();
        ret.put("paketList", new JSArray(new ObjectMapper().writeValueAsString(paketList)));
        call.resolve(ret);
    }
}
