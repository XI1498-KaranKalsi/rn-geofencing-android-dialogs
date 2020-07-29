import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"lightgray"
    },
    addGeofenceCard: {
        margin:15,
        padding:10,
        backgroundColor:"white",
        elevation:5,
    },
    addGeofenceHeader: {
        fontSize:18,
        fontWeight:"bold",
        color: "red"
    },
    geofenceTextInput: {
        marginTop:10,
        paddingStart:10,
        borderWidth:1,
        borderRadius:5,
        borderColor:"black"
    },
    geofenceAddButtonContainer: {
        marginTop:10,
    },
    geofenceList: {
    },
    geofenceItemCard: {
        marginHorizontal:15,
        marginTop:10,
        padding:10,
        backgroundColor:"white",
        elevation:5,
        marginTop:10,
    },
    geofenceListItemDeleteButton:{
        marginTop:15,
    }
})