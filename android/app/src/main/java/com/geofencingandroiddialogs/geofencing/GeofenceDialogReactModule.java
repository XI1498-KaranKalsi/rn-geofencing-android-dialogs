package com.geofencingandroiddialogs.geofencing;


import android.os.Bundle;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONException;
import org.json.JSONObject;

public class GeofenceDialogReactModule extends ReactContextBaseJavaModule {
    private  ReactApplicationContext reactContext;

    GeofenceDialogReactModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "GeofenceDialogReactModule";
    }

    @ReactMethod
    public void show(String dataJson) {
        try {
            JSONObject jsonObject = new JSONObject(dataJson);
            String action = jsonObject.getString("action");
            String identifier = jsonObject.getString("identifier");
            String[] identifierArr =identifier.split("_");
            Bundle bundle = new Bundle();
            bundle.putString(GeofenceDialogExtras.IDENTIFIER,identifier);
            bundle.putString(GeofenceDialogExtras.ACTION,action);
            bundle.putString(GeofenceDialogExtras.NAME,identifierArr[0]);
            bundle.putString(GeofenceDialogExtras.RADIUS,identifierArr[1]);
            bundle.putString(GeofenceDialogExtras.LATITUDE,identifierArr[2]);
            bundle.putString(GeofenceDialogExtras.LONGITUDE,identifierArr[3]);
            GeofenceDialog.show(reactContext, bundle);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
