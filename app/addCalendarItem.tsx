import React, {useEffect, useState} from "react";
import {SafeAreaView, View} from "react-native";
import {Stack} from "expo-router";
import {Dialog} from 'react-native-simple-dialogs';
import {Box, Button, Flex, Snackbar, Spacer, Text} from "@react-native-material/core";
import RNDateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Dropdown} from "react-native-element-dropdown";
import {getLocationApi} from "./api/LocationApi";
import {getSubLocationApi} from "./api/SubLocationApi";
import {getEventApi} from "./api/EventApi";
import {addCalendarApi} from "./api/AddCalendarApi";
import {LocationDto} from './data/LocationDto'
import {SubLocationDto} from './data/SubLocationDto'
import {EventDto} from './data/EventDto'
import {GymCalendarDto} from "./data/GymCalendarDto";

const AddCalendarItem = () => {
    const CURRENT_DATE: Date = new Date(Date.now());
    const [submitResult, setSubmitResult] = useState<GymCalendarDto>({
        calendar_id: 0,
        location_name: "",
        sub_location_name: "",
        event_name: "",
        event_start_time: CURRENT_DATE,
        event_end_time: CURRENT_DATE
    })
    const [locationData, setLocationData] = useState<LocationDto[]>([])
    const [location, setLocation] = useState<number | null>(null)
    const [subLocationData, setSubLocationData] = useState<SubLocationDto[]>([])
    const [subLocationFilter, setSubLocationFilter] = useState<SubLocationDto[]>([])
    const [subLocation, setSubLocation] = useState<number | null>(null)
    const [eventData, setEventData] = useState<EventDto[]>([])
    const [event, setEvent] = useState<number | null>(null)
    const [startDate, setStartDate] = useState<Date>(CURRENT_DATE)
    const [startTime, setStartTime] = useState<Date>(CURRENT_DATE)
    const [endDate, setEndDate] = useState<Date>(CURRENT_DATE)
    const [endTime, setEndTime] = useState<Date>(CURRENT_DATE)
    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false)
    const [showStartTimePicker, setShowStartTimePicker] = useState<boolean>(false)
    const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false)
    const [showEndTimePicker, setShowEndTimePicker] = useState<boolean>(false)
    const [showSubmitDialog, setShowSubmitDialog] = useState<boolean>(false)
    const [showMessageBar, setShowMessageBar] = useState<boolean>(false)

    const fetchDate = async () => {
        setLocationData(await getLocationApi())
        setSubLocationData(await getSubLocationApi())
        setEventData(await getEventApi())
    }
    const handleSelectLocation = (event: { location_name: string } & { location_id: number }) => {
        setLocation(event.location_id)
        setSubLocationFilter(subLocationData.filter(value => value.location_id === event.location_id))
    }
    const handleSelectSubLocation = (event: { subLocation_name: string } & { subLocation_id: number }) => {
        setSubLocation(event.subLocation_id)
    }
    const handleSelectEvent = (event: { event_name: string } & { event_id: number }) => {
        setEvent(event.event_id)
    }
    const handleShowStartDatePicker = () => {
        setShowStartDatePicker(true)
    }
    const handleShowEndDatePicker = () => {
        setShowEndDatePicker(true)
    }
    const handlePickStartDate = (event: DateTimePickerEvent, date: Date) => {
        setStartDate(date)
        setShowStartDatePicker(false)
        setShowStartTimePicker(true)
    }
    const handlePickStartTime = (event: DateTimePickerEvent, date: Date) => {
        setStartTime(date)
        setShowStartTimePicker(false)
    }
    const handlePickEndDate = (event: DateTimePickerEvent, date: Date) => {
        setEndDate(date)
        setShowEndDatePicker(false)
        setShowEndTimePicker(true)
    }
    const handlePickEndTime = (event: DateTimePickerEvent, date: Date) => {
        setEndTime(date)
        setShowEndTimePicker(false)
    }
    const handleSubmit = async () => {
        if (location==null|| subLocation==null|| event==null)   {
            setShowMessageBar(true)
        }
        else {
            const eventStartTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startTime.getHours(), startTime.getMinutes(), 0, 0)
            const eventEndTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endTime.getHours(), endTime.getMinutes(), 0, 0)
            setSubmitResult(await addCalendarApi({
                location_id: location,
                sub_location_id: subLocation,
                event_id: event,
                event_start_time: eventStartTime,
                event_end_time: eventEndTime
            }))
            setShowSubmitDialog(true)
        }
    }

    useEffect(() => {
        void fetchDate()
    }, []);

    const messageBar = () => {
        if(showMessageBar)  {
            return <Snackbar
                message="Please fill all the information"
                action={<Button variant="text" title="Dismiss" color="#BB86FC" compact onPress={()=> {setShowMessageBar(false)}}/>}
                style={{ position: "absolute", start: 0, end: 0, bottom: 0 }}
            />
        }   else
            return <></>
    }

    const submitDialog = () => {
        if (submitResult.calendar_id != 0) {
            return <Dialog
                visible={showSubmitDialog}
                title="Result"
                onTouchOutside={() => setShowSubmitDialog(false)}
                contentInsetAdjustmentBehavior="automatic"
                onRequestClose={() => {
                }}>
                <View>
                    <Text>
                        CalendarID: {submitResult.calendar_id}</Text>
                    <Text>
                        Location Name: {submitResult.location_name}</Text>
                    <Text>
                        Sub Location Name: {submitResult.sub_location_name}</Text>
                    <Text>
                        Event Name: {submitResult.event_name}</Text>
                    <Text>
                        Event Start Time:
                        {submitResult.event_start_time.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"})}
                    </Text>
                    <Text>
                        Event End Time:
                        {submitResult.event_end_time.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"})}
                    </Text>
                </View>
            </Dialog>
        } else
            return <Dialog
                visible={showSubmitDialog}
                title="Result"
                onTouchOutside={() => setShowSubmitDialog(false)}
                contentInsetAdjustmentBehavior="automatic"
                onRequestClose={() => {
                }}>
                <View>
                    <Text>Something Wrong!</Text>
                </View>
            </Dialog>
    }

    return <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Create new Event'
            }}/>
        <View style={{margin: "5%", height: "95%"}}>
            <Dropdown placeholder="Select Location"
                      data={locationData}
                      labelField="location_name"
                      valueField="location_id"
                      onChange={handleSelectLocation}/>
            <Box style={{height: 30}}></Box>
            <Dropdown placeholder="Select Sub Location"
                      data={subLocationFilter}
                      labelField="subLocation_name"
                      valueField="subLocation_id"
                      dropdownPosition="bottom"
                      onChange={handleSelectSubLocation}/>
            <Box style={{height: 30}}></Box>
            <Dropdown placeholder="Select Event"
                      data={eventData}
                      labelField="event_name"
                      valueField="event_id"
                      onChange={handleSelectEvent}/>
            <Box style={{height: 30}}></Box>
            <Flex direction="row">
                <Button title="Start Time"
                        onPress={handleShowStartDatePicker}/>
                <Spacer/>
                <Text>
                    {startDate.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"}).split(',')[0]}
                    {startTime.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"}).split(',')[1].split(':')[0]}:
                    {startTime.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"}).split(',')[1].split(':')[1]}
                </Text>
            </Flex>
            <Box style={{height: 30}}></Box>
            <Flex direction="row">
                <Button title="End Time" onPress={handleShowEndDatePicker}/>
                <Spacer/>
                <Text>
                    {endDate.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"}).split(',')[0]}
                    {endTime.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"}).split(',')[1].split(':')[0]}:
                    {endTime.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"}).split(',')[1].split(':')[1]}
                </Text>
            </Flex>
            <Box style={{height: 30}}></Box>
            {showStartDatePicker &&
                <RNDateTimePicker
                    value={startDate}
                    mode="date"
                    onChange={handlePickStartDate}
                />
            }
            {showStartTimePicker &&
                <RNDateTimePicker
                    value={startTime}
                    mode="time"
                    onChange={handlePickStartTime}
                />
            }
            {showEndDatePicker &&
                <RNDateTimePicker
                    value={endDate}
                    mode="date"
                    onChange={handlePickEndDate}
                />
            }
            {showEndTimePicker &&
                <RNDateTimePicker
                    value={endTime}
                    mode="time"
                    onChange={handlePickEndTime}
                />
            }
            <Button title="Submit" onPress={handleSubmit}/>
            {submitDialog()}
            {messageBar()}
        </View>
    </SafeAreaView>
}

export default AddCalendarItem