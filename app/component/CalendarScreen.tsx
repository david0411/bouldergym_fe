import React, {Fragment, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Calendar, CalendarUtils} from 'react-native-calendars';
import testIDs from '../testIDs';
import {GymCalendarDto} from '../data/GymCalendarDto'
import {ListItem} from "@react-native-material/core";
import {getCalendarApi} from "../api/CalendarApi";

const mockData:GymCalendarDto[] = [
    {
        "calendar_id": 1,
        "location_name": "Raccoon Bouldering",
        "sub_location_name": "Nimble",
        "event_name": "Route Setting",
        "event_start_time": "2023-07-06T16:00:00.000+00:00",
        "event_end_time": "2023-07-07T15:59:59.000+00:00"
    },
    {
        "calendar_id": 2,
        "location_name": "Raccoon Bouldering",
        "sub_location_name": "Nimble",
        "event_name": "Route Setting",
        "event_start_time": "2023-07-27T16:00:00.000+00:00",
        "event_end_time": "2023-07-28T15:59:59.000+00:00"
    },
    {
        "calendar_id": 3,
        "location_name": "Raccoon Bouldering",
        "sub_location_name": "Papay and Jolly",
        "event_name": "Route Setting",
        "event_start_time": "2023-07-16T16:00:00.000+00:00",
        "event_end_time": "2023-07-17T15:59:59.000+00:00"
    },
    {
        "calendar_id": 5,
        "location_name": "Kizuna Climbing",
        "sub_location_name": "Half 1",
        "event_name": "Route Setting",
        "event_start_time": "2023-07-02T16:00:00.000+00:00",
        "event_end_time": "2023-07-03T15:59:59.000+00:00"
    }
]

const CURRENT_DATE:Date = new Date(Date.now());

const INITIAL_DATE: string = CURRENT_DATE.toISOString().split('T')[0];

const DisplayMonth = (date:Date) => {
    return date.toDateString().split(' ')[1] + "-" + date.toDateString().split(' ')[3]
}

const CalendarScreen = () => {
    const [selected, setSelected] = useState<string>(INITIAL_DATE);
    const [currentMonth, setCurrentMonth] = useState<string>(DisplayMonth(CURRENT_DATE));
    const [calendarData, setCalendarData] = useState<GymCalendarDto[]>([])

    const fetchCalendar = async () => {
        setCalendarData(await getCalendarApi(selected.toString().split('-')[0],selected.toString().split('-')[1]))
    }

    const onDayPress = useCallback((day) => {
        setSelected(day.dateString);
    }, []);

    const marked = useMemo(() => {
        let markedDay = {
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'orange',
                selectedTextColor: 'red'
            }}
        let markedDots = {}
        mockData.map((value,index) => {
            markedDots[CalendarUtils.getCalendarDateString(value.event_start_time)] = {
                dots: [
                    {key: value.event_name, color: 'blue', selectedDotColor: 'red'}
                ]
            }
        })
        return {
            ...markedDots,
            ...markedDay
        }
    }, [selected]);

    const customHeaderProps: any = useRef();

    const setCustomHeaderNewMonth = (next:boolean = false) => {
        const add:number = next ? 1 : -1;
        const month:Date = new Date(customHeaderProps?.current?.month);
        const newMonth:Date = new Date(month.setMonth(month.getMonth() + add));
        customHeaderProps?.current?.addMonth(add);
        setCurrentMonth(DisplayMonth(newMonth));
    };
    const moveNext = () => {
        setCustomHeaderNewMonth(true);
    };
    const movePrevious = () => {
        setCustomHeaderNewMonth(false);
    };
    const handleCalendarItemPress = ()=>{

    }
    const renderCalendarWithSelectableDate = () => {
        const CustomHeader = React.forwardRef((props, ref) => {
            customHeaderProps.current = props;

            return (
                // @ts-expect-error
                <View ref={ref} {...props}
                      style={{backgroundColor: '#eebb8f',
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                          marginHorizontal: -4,
                          padding: 8}}>
                    <TouchableOpacity onPress={movePrevious}>
                        <Text>Previous</Text>
                    </TouchableOpacity>
                    <Text>{currentMonth}</Text>
                    <TouchableOpacity onPress={moveNext}>
                        <Text>Next</Text>
                    </TouchableOpacity>
                </View>
            );
        });

        return (
            <Fragment>
                <Calendar
                    customHeader={CustomHeader}
                    testID={testIDs.calendars.FIRST}
                    enableSwipeMonths
                    current={INITIAL_DATE}
                    style={{marginBottom: 10}}
                    onDayPress={onDayPress}
                    markingType={'multi-dot'}
                    markedDates={marked}
                />
            </Fragment>
        );
    };
    const calendarItem = () => {
        return mockData.filter(value =>
            CalendarUtils.getCalendarDateString(value.event_start_time) === CalendarUtils.getCalendarDateString(selected)
        ).map((value) => {
            return (<>
                    <ListItem
                        key={value.calendar_id}
                        title={value.location_name}
                        secondaryText={value.sub_location_name + ": " + value.event_name}
                        onPress={handleCalendarItemPress}
                    />
            </>
            )
        })
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} testID={testIDs.calendars.CONTAINER}>
            {renderCalendarWithSelectableDate()}
            <ScrollView>
                {calendarItem()}
            </ScrollView>
        </ScrollView>
    );
};

export default CalendarScreen;