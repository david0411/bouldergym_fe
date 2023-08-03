import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native";
import {Stack} from "expo-router";
import {
    Provider,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogHeader,
    Text, Flex
} from "@react-native-material/core";
import RNDateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Dropdown} from "react-native-element-dropdown";
import {getLocationApi} from "./api/LocationApi";
import {getSubLocationApi} from "./api/SubLocationApi";
import {getEventApi} from "./api/EventApi";
import {LocationDto} from './data/LocationDto'
import {SubLocationDto} from './data/SubLocationDto'
import {EventDto} from './data/EventDto'
import {addCalendarApi} from "./api/AddCalendarApi";
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

    useEffect(() => {
        void fetchDate()
    }, []);

    const submitDialog = () => {
        if (submitResult.calendar_id != 0) {
            return <Provider>
                <Dialog visible={showSubmitDialog} onDismiss={() => setShowSubmitDialog(false)}>
                    <DialogHeader title="Result"/>
                    <DialogContent>
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
                    </DialogContent>
                    <DialogActions>
                        <Button
                            title="Ok"
                            compact
                            variant="text"
                            onPress={() => setShowSubmitDialog(false)}
                        />
                    </DialogActions>
                </Dialog>
            </Provider>
        } else
            return <Provider>
                <Dialog visible={showSubmitDialog} onDismiss={() => setShowSubmitDialog(false)}>
                    <DialogHeader title="Result"/>
                    <DialogContent>
                        <Text>Error</Text>
                    </DialogContent>
                </Dialog>
            </Provider>
    }

    return <SafeAreaView>
        <Stack.Screen
            options={{
                headerTitle: 'Create new Event'
            }}/>
        <Box style={{height: 30}}></Box>
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
            <Button title="Event Start Time"
                    onPress={handleShowStartDatePicker}/>
            <Box style={{height: 30}}></Box>
            <Text>
                {startDate.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"}).split(',')[0]}
                {startTime.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"}).split(',')[1].split(':')[0]}:
                {startTime.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"}).split(',')[1].split(':')[1]}
            </Text>
            <Box style={{height: 30}}></Box>
            <Button title="Event End Time" onPress={handleShowEndDatePicker}/>
            <Box style={{height: 30}}></Box>
            <Text>
                {endDate.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"}).split(',')[0]}
                {endTime.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"}).split(',')[1].split(':')[0]}:
                {endTime.toLocaleString("en-gb", {timeZone: "Asia/Hong_Kong"}).split(',')[1].split(':')[1]}
            </Text>
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
    </SafeAreaView>
}

export default AddCalendarItem