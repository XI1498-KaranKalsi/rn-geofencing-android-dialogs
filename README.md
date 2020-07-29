# rn-geofencing-android-dialogs
An example to show native Android dialogs on geofence event


# Steps
1) yarn
2) react-native run-android
3) Add a geofence
4) Enter the geofence to view Enter dialog
5) Enter the geofence to view Exit dialog
6) Kill App and repeat same
7) You will notice that once the app is killed and you after you enter a geofence and Enter dialog come up, HeadlessTask will stop receiving geofence events unless you close the dialog.
