import React, {useEffect, useState} from 'react';
import {StyleSheet, Switch, Text, View} from "react-native";
import {LocationFilterData} from "../data/LocationFilterData";

type LocationItem = {
    locationFilterData:LocationFilterData
    saveToggleSwitch: () => void
}

const LocationFilterItem = ({locationFilterData,saveToggleSwitch}: LocationItem) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        saveToggleSwitch()
    }

    useEffect(() => {
        void setIsEnabled(locationFilterData.selected)
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.location}>{locationFilterData.location.location_name}</Text>
            <Switch
                value={isEnabled}
                onValueChange={toggleSwitch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    location: {
        fontSize: 20,
    },
});


export default LocationFilterItem;