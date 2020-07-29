import React from "react";
import { SafeAreaView, View, Text, TextInput, Button, FlatList, Keyboard } from "react-native";
import styles from "./MainContainerStyle";
import geofencingUtil from "./util/geofencingUtil";


class MainContainer extends React.Component {

    state = {
        geofenceInputName: "",
        geofenceInputCoordinates: "",
        geofenceRadius: "",
        geofences: [],
    }

    componentDidMount() {
        geofencingUtil.initGeofencing().then(this._displayGeofences);

    }

    async componentWillUnmount() {
        await geofencingUtil.removeListener();
    }

    _displayGeofences = async () => {
        const geofences = await geofencingUtil.getGeofences();
        this.setState({ geofences });
    }

    _resetInput = () => {
        this.setState({
            geofenceInputName: "",
            geofenceInputCoordinates: "",
            geofenceRadius: "",
        })
    }

    _addGeofence = () => {
        const {
            geofenceInputName,
            geofenceInputCoordinates,
            geofenceRadius,
        } = this.state;
        Keyboard.dismiss();
        const onSuccess = () => {
            this._resetInput();
            this._displayGeofences();
        }
        const onFailure = (e) => {
            alert(e);
        }
        geofencingUtil.addGeofence({ name: geofenceInputName, coordinates: geofenceInputCoordinates, radius: geofenceRadius })
            .then(onSuccess)
            .catch(onFailure)
    }

    _textEmpty = (txt) => !(txt && txt.trim().length)

    _geofenceAddButtonDisabled = () => {
        const {
            geofenceInputName,
            geofenceInputCoordinates,
            geofenceRadius,
        } = this.state;

        return this._textEmpty(geofenceInputName) ||
            this._textEmpty(geofenceInputCoordinates) ||
            this._textEmpty(geofenceRadius);
    }

    _onGeofenceItemDeletePress = (geofence) => {
        geofencingUtil.removeGeofence(geofence.identifier)
        .then(this._displayGeofences);
    }

    render() {
        const {
            geofenceInputName,
            geofenceInputCoordinates,
            geofenceRadius,
        } = this.state;
        const addButtonDisabled = this._geofenceAddButtonDisabled();
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.addGeofenceCard}>
                    <Text style={styles.addGeofenceHeader}>Add a Geofence</Text>
                    <TextInput
                        style={styles.geofenceTextInput}
                        placeholder={"Name"}
                        onChangeText={v => this.setState({ geofenceInputName: v })}
                        value={geofenceInputName}
                    />
                    <TextInput
                        style={styles.geofenceTextInput}
                        placeholder={"Coordinates (Latitude, Longitude)"}
                        keyboardType={"numeric"}
                        onChangeText={v => this.setState({ geofenceInputCoordinates: v })}
                        value={geofenceInputCoordinates}
                    />
                    <TextInput
                        style={styles.geofenceTextInput}
                        placeholder={"Radius"}
                        keyboardType={"numeric"}
                        value={this.state}
                        onChangeText={v => this.setState({ geofenceRadius: v })}
                        value={geofenceRadius}
                    />
                    <View
                        style={styles.geofenceAddButtonContainer}
                    >
                        <Button
                            title="Add"
                            onPress={this._addGeofence}
                            disabled={addButtonDisabled}
                        />
                    </View>
                </View>
                <FlatList
                    style={styles.geofenceList}
                    data={this.state.geofences}
                    keyExtractor={item => item.identifier}
                    renderItem={({ item }) => <GeofenceListItem geofence={item} onDelete={this._onGeofenceItemDeletePress}/>}
                />
            </SafeAreaView>)
    }
}

function GeofenceListItem(props) {
    const { geofence, onDelete } = props;
    const { identifier } = geofence;
    const identifierArr = identifier.split("_");
    const detail = {
        "Identifier": identifier,
        "Name": identifierArr[0],
        "Radius": identifierArr[1],
        "Latitude": identifierArr[2],
        "Longitude": identifierArr[3],
    }
    const handleDeletePress = () => onDelete(geofence);
    return (<View style={styles.geofenceItemCard}>
        {Object.keys(detail).map(key => {
            return (<Text key={key}>
                <Text style={{ fontWeight: "bold" }}>{key}:</Text> {detail[key]}
            </Text>)
        })}
        <View style={styles.geofenceListItemDeleteButton}>
            <Button
                color="tomato"
                title="Delete"
                onPress={handleDeletePress}
            />
        </View>
    </View>)
}

export default MainContainer;