// @flow
import * as React from 'react';
import {useEffect, useState} from "react";
import {LocationDto} from "../data/LocationDto";
import {getLocationApi} from "../api/LocationApi";
import {StyleSheet, SafeAreaView, FlatList, Text, Switch, View} from "react-native";
import {Stack} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationFilterItem from "./LocationFilterItem";
import {LocationFilterData} from "../data/LocationFilterData";

const LocationFilter = () => {
    const [locationData, setLocationData] = useState<LocationDto[]>([])
    const [locationFilterData, setLocationFilterData] = useState<LocationFilterData[]>([])
    const toggleSwitch = async (index: number) => {
        let locationFilterData_new = locationFilterData
        locationFilterData_new[index].selected = !locationFilterData_new[index].selected
        await AsyncStorage.setItem('@locationFilter', JSON.stringify(locationFilterData_new))
    }
    const fetchData = async () => {
        let location = await getLocationApi().then()
        setLocationData(location)
        const value = await AsyncStorage.multiGet(['@locationFilter'])
        if (value[0][1] == null) {
            setLocationFilterData(location.map((value):LocationFilterData => {
                    return {location: value, selected: true}
                }
            ))
        }   else {
            setLocationFilterData(JSON.parse(value[0][1]))
        }

    }

    useEffect(() => {
        void fetchData()
    }, []);

    const locationList = () => {
        if (locationData) {
            return (
                <FlatList
                    data={locationFilterData}
                    renderItem={({item, index}) => (
                        <LocationFilterItem locationFilterData={item} saveToggleSwitch={() => toggleSwitch(index)}/>
                    )}
                />)
        }
    }
    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    headerTitle: 'Filter Location'
                }}/>
            {locationList()}
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'stretch'
    },
    location: {
        fontSize: 20,
    },
});

export default LocationFilter
