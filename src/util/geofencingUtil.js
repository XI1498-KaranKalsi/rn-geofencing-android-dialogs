
import BackgroundGeolocation from "react-native-background-geolocation";
import { Platform } from "react-native";
import GeofenceDialog from '../util/geofenceDialog';

const TAG = "GeofencingUtil";
const CONFIG = {
    // Geolocation Config
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 10,
    // Activity Recognition
    stopTimeout: 15,
    // Application config
    debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    enableHeadless: true,
    stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
    startOnBoot: true, // <-- Auto start tracking when device is powered-up.
  };

  const GeofencingHeadlessTask = async event => {
    switch (event.name) {
      case "geofence":
        onGeofence(event.params ,true);
        break;
    }
  };

  const onGeofence = (event, headless = false) => {
    const type = "onGeofence" + (headless ? " Headless" : "");
    console.log(TAG, type,  event);
    if(Platform.OS === "android") {
      GeofenceDialog.show(JSON.stringify(event));
    }
  }

  BackgroundGeolocation.registerHeadlessTask(GeofencingHeadlessTask);
  
  async function initGeofencing() {
    await BackgroundGeolocation.removeListeners();
    await BackgroundGeolocation.onGeofence(onGeofence);
    const state = await BackgroundGeolocation.ready(CONFIG);
    if (!state.enabled) {
      BackgroundGeolocation.start(function() {
        console.log(TAG,"- Start success");
      });
    }
  }

  async function addGeofence({ name, coordinates, radius}) {
    const coordinatesArr = coordinates.split(",").map(item=>item.trim()); 
    const radiusN = Number(radius); 
    const location = { latitude: Number(coordinatesArr[0]), longitude:Number(coordinatesArr[1]) }
    await BackgroundGeolocation.addGeofence({
        latitude: location.latitude,
        longitude:location.longitude,
        identifier: `${name}_${radiusN}_${location.latitude}_${location.longitude}`,
        radius: radiusN,
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyOnDwell: false,
        extras: {
          radius: radiusN,
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
      })
  }

  async function removeGeofence(id) {
    await BackgroundGeolocation.removeGeofence(id);
  }

  async function getGeofences() {
    return await BackgroundGeolocation.getGeofences();
  }

  async function removeListener() {
    await BackgroundGeolocation.removeListeners();
  }

  export default {
      initGeofencing,
      addGeofence,
      removeGeofence,
      getGeofences,
      removeListener,
  };