package com.codeyzer.android;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;

import com.getcapacitor.BridgeActivity;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class MainActivity extends BridgeActivity {

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(CodeyzerAutofillPlugin.class);

//        AutofillManager autofillManager = getApplicationContext().getSystemService(AutofillManager.class);
//        if (!autofillManager.hasEnabledAutofillServices()) {
//            Intent intent = new Intent(Settings.ACTION_REQUEST_SET_AUTOFILL_SERVICE, Uri.parse("package:com.codeyzer.android"));
//            startActivity(intent);
//        }
    }
}
