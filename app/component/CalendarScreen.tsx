import {useRouter} from "expo-router";
import React, {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Calendar, CalendarUtils} from 'react-native-calendars';
import {ListItem} from "@react-native-material/core";
import Loading from "./Loading";
import testIDs from '../testIDs';
import {GymCalendarDto} from '../data/GymCalendarDto'
import {getCalendarApi} from "../api/CalendarApi";
import {DateData} from "react-native-calendars/src/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CURRENT_DATE: Date = new Date(Date.now());
const INITIAL_DATE: string = CURRENT_DATE.toISOString().split('T')[0];
const DisplayMonth = (date: Date) => {
    return date.toDateString().split(' ')[1] + "-" + date.toDateString().split(' ')[3]
}

const CalendarScreen = () => {
    const [selected, setSelected] = useState<string>('')
    const [currentMonth, setCurrentMonth] = useState<Date>(CURRENT_DATE)
    const [calendarData, setCalendarData] = useState<GymCalendarDto[]>([])
    const [dots, setDots] = useState({})
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter()

    useEffect(() => {
        void fetchCalendar()
    }, [currentMonth])

    const fetchCalendar = async () => {
        // console.log("Getting Calendar " + currentMonth.getFullYear() + " " + (currentMonth.getMonth() + 1).toString())
        const result:GymCalendarDto[] = await getCalendarApi(currentMonth.getFullYear().toString(), (currentMonth.getMonth() + 1).toString())
        const value = await AsyncStorage.multiGet(['@locationFilter'])
        const showResult = result.filter(
            (value1) => JSON.parse(value[0][1]).filter(
                (value: { selected: boolean; }) => value.selected==true).map(
                    (value: { location: { location_name: any; }; }) => value.location.location_name).includes(
                        value1.location_name
            )
        )
        setCalendarData(showResult)
        let markedDots = {}
        showResult.map((value) => {
            markedDots[CalendarUtils.getCalendarDateString(value.event_start_time)] = {
                dots: [
                    {key: value.event_name, color: 'blue', selectedDotColor: 'red'}
                ]
            }
        })
        setDots(markedDots)
        setLoading(false)
    }

    const onDayPress = (day: DateData) => {
        setSelected(day.dateString);
    }

    const marked = useMemo(() => {
        let markedDay = {
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'orange',
                selectedTextColor: 'red'
            }
        }
        return {
            ...dots,
            ...markedDay
        }
    }, [selected, dots]);

    const customHeaderProps: any = useRef();

    const setCustomHeaderNewMonth = (next: boolean = false) => {
        const add: number = next ? 1 : -1;
        const month: Date = new Date(customHeaderProps?.current?.month);
        const newMonth: Date = new Date(month.setMonth(month.getMonth() + add));
        customHeaderProps?.current?.addMonth(add);
        setCurrentMonth(newMonth);
    };
    const moveNext = () => {
        setCustomHeaderNewMonth(true);
    };
    const movePrevious = () => {
        setCustomHeaderNewMonth(false);
    };

    const renderCalendar = () => {
        if(loading) {
            return <Loading/>
        }  else {
            const CustomHeader = React.forwardRef((props, ref) => {
                customHeaderProps.current = props;
                return (
                    // @ts-expect-error
                    <View ref={ref} {...props}
                          style={{
                              backgroundColor: '#eebb8f',
                              flexDirection: 'row',
                              justifyContent: 'space-around',
                              marginHorizontal: -4,
                              padding: 8
                          }}>
                        <TouchableOpacity onPress={movePrevious}>
                            <Text>Previous</Text>
                        </TouchableOpacity>
                        <Text>{DisplayMonth(currentMonth)}</Text>
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
        }
    };

    const calendarItem = () => {
        if (calendarData) {
            return calendarData.filter(value =>
                CalendarUtils.getCalendarDateString(value.event_start_time) === CalendarUtils.getCalendarDateString(selected)
            ).map((value) => {
                return (
                    <ListItem
                        key={value.calendar_id}
                        title={value.location_name}
                        secondaryText={value.sub_location_name + ": " + value.event_name}
                        onPress={() => {
                            router.push({pathname: "/details/[id]", params: {id: value.calendar_id}})
                        }}
                    />
                )
            })
        }
        return <Loading/>
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}
                    testID={testIDs.calendars.CONTAINER}>
            {renderCalendar()}
            <ScrollView>
                {calendarItem()}
            </ScrollView>
        </ScrollView>
    );
};

export default CalendarScreen;