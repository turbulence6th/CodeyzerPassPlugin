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
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CapacitorPlugin(name = "CodeyzerAutofillPlugin")
public class CodeyzerAutofillPlugin extends Plugin {

    @RequiresApi(api = Build.VERSION_CODES.O)
    @PluginMethod
    public void sifreListesiEkle(PluginCall call) throws Exception {
        List<String> hariciSifreListesi = new ObjectMapper().readValue(call.getArray("hariciSifreListesi").toString(),
                new TypeReference<List<String>>() {});

        SharedPreferences capacitorSharedPreferences = getContext().getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String depoStr = capacitorSharedPreferences.getString("depo", "{}");
        Depo depo = new ObjectMapper().readValue(depoStr, Depo.class);

        Map<String, List<String>> paketMap = new HashMap<>();
        for (String sifreliMatin : hariciSifreListesi) {
            HariciSifreIcerik icerik = KriptoUtil.desifreEt(sifreliMatin, depo.getSifre());
            String paket = icerik.getAndroidPaket();
            if (paket != null && !paket.isEmpty()) {
                List<String> liste = paketMap.get(paket);
                if (liste == null) {
                    liste = new ArrayList<>();
                    liste.add(sifreliMatin);
                    paketMap.put(paket, liste);
                } else {
                    liste.add(sifreliMatin);
                }
            }
        }

        SharedPreferences sharedPreferences = getContext().getSharedPreferences("paketMap", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("paketMap", new ObjectMapper().writeValueAsString(paketMap));
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
