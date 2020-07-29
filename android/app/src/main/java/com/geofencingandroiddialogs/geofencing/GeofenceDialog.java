package com.geofencingandroiddialogs.geofencing;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.TextView;

import androidx.core.content.ContextCompat;

import com.geofencingandroiddialogs.MainActivity;
import com.geofencingandroiddialogs.R;

import java.util.List;

public class GeofenceDialog extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTransparentWindow();
        this.setFinishOnTouchOutside(false);
        setContentView(R.layout.activity_geofence_dialog);
        getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        setData(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setData(intent);
    }

    private void setData(Intent intent) {
        Bundle bundle = intent.getExtras();
        if(bundle != null) {
            String action = bundle.getString(GeofenceDialogExtras.ACTION,"");
            String id = bundle.getString(GeofenceDialogExtras.IDENTIFIER,"");
            String name = bundle.getString(GeofenceDialogExtras.NAME,"");
            String radius = bundle.getString(GeofenceDialogExtras.RADIUS,"");
            String latitude = bundle.getString(GeofenceDialogExtras.LATITUDE,"");
            String longitude = bundle.getString(GeofenceDialogExtras.LONGITUDE,"");

            boolean isMainActivityActive = isMainActivityActive();
            boolean isEntered = action.equalsIgnoreCase("ENTER");

            View dialogContainer = findViewById(R.id.dialog_container);
            TextView headerTv = findViewById(R.id.header_tv);
            TextView subHeaderTv = findViewById(R.id.sub_header_tv);
            TextView idTv = findViewById(R.id.id_tv);
            TextView nameTv = findViewById(R.id.name_tv);
            TextView radiusTv = findViewById(R.id.radius_tv);
            TextView locationTv = findViewById(R.id.location_tv);

            //Set Dialog Background
            dialogContainer.setBackgroundResource(isEntered ? R.drawable.geofence_dialog_enter_bg : R.drawable.geofence_dialog_exit_bg);

            //Set Header
            headerTv.setText(getString(R.string.header_dialog_txt, isEntered ? "ENTERED" : "EXITED"));

            // Set SubHeader
            subHeaderTv.setText(getString(R.string.sub_header_dialog_txt,isMainActivityActive ? "Active" : "InActive"));
            int subHeaderColor = ContextCompat.getColor(this,isMainActivityActive ? R.color.geofenceEnterColor :  R.color.geofenceExitColor);
            subHeaderTv.setTextColor(subHeaderColor);

            //Set Identifier
            idTv.setText(getString(R.string.identifier_dialog_txt_format,id));

            //Set Name
            nameTv.setText(getString(R.string.name_dialog_txt_format,name));

            //Set Location
            locationTv.setText(getString(R.string.location_dialog_txt_format,latitude,longitude));

            //Set Radius
            radiusTv.setText(getString(R.string.radius_dialog_txt_format,radius));


        }


    }

    private void setTransparentWindow() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            getWindow().setStatusBarColor(Color.TRANSPARENT);
        }
        getWindow().setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
    }

    public static void show(Context context, Bundle bundle) {
        Intent intent = new Intent(context, GeofenceDialog.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtras(bundle);
        context.startActivity(intent);
    }

    protected Boolean isMainActivityActive()
    {
        ActivityManager activityManager = (ActivityManager) getBaseContext().getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> tasks = activityManager.getRunningTasks(Integer.MAX_VALUE);

        for (ActivityManager.RunningTaskInfo task : tasks) {
            if (MainActivity.class.getCanonicalName().equalsIgnoreCase(task.baseActivity.getClassName()))
                return true;
        }

        return false;
    }

    public void onDialogCloseClick(View view) {
        this.finish();
    }
}
