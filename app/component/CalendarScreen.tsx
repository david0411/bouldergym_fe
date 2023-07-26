import React, {Fragment, useCallback, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Calendar, CalendarUtils} from 'react-native-calendars';
import testIDs from '../testIDs';
import {GymCalendarDto} from '../data/GymCalendarDto'
import * as mock_data from '../mock_data.json'
import {ListItem} from "@react-native-material/core";

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

    const getDate = (count: number) => {
        const date:Date = new Date(CURRENT_DATE)
        const newDate:number = date.setDate(date.getDate() + count);
        return CalendarUtils.getCalendarDateString(newDate);
    };

    const onDayPress = useCallback((day) => {
        setSelected(day.dateString);
    }, []);
    useMemo(() => {
        return {
            [getDate(-1)]: {
                dotColor: 'red',
                marked: true
            },
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'orange',
                selectedTextColor: 'red'
            }
        };
    }, [selected]);
    const renderCalendarWithSelectableDate = () => {
        const CustomHeader = React.forwardRef((props, ref) => {
            customHeaderProps.current = props;

            return (
                // @ts-expect-error
                <View ref={ref} {...props} style={styles.customHeader}>
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
                    style={styles.calendar}
                    onDayPress={onDayPress}
                    markingType={'multi-dot'}
                    markedDates={handleDots()}
                />
            </Fragment>
        );
    };
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

    function handleDots() {
        console.log(mockData.map((value) => {
            const date:Date = new Date(CURRENT_DATE)
            return (CalendarUtils.getCalendarDateString(date.setDate(value.event_start_time.getDate())))
        }))
        return {
            [getDate(2)]: {
                dots: [
                    {key: 'vacation', color: 'blue', selectedDotColor: 'red'},
                    {key: 'massage', color: 'red', selectedDotColor: 'white'}
                ]
            },
            [getDate(3)]: {
                dots: [
                    {key: 'vacation', color: 'green', selectedDotColor: 'red'},
                    {key: 'massage', color: 'red', selectedDotColor: 'green'}
                ]
            }
        }
    }

    const calendarItem = () => {
        return mockData.map((value) => {
            return (<>
                    <ListItem
                        key={value.calendar_id}
                        title={value.location_name}
                        secondaryText={value.sub_location_name}
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

const styles = StyleSheet.create({
    calendar: {
        marginBottom: 10
    },
    switchContainer: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center'
    },
    switchText: {
        margin: 10,
        fontSize: 16
    },
    text: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'lightgrey',
        fontSize: 16
    },
    disabledText: {
        color: 'grey'
    },
    defaultText: {
        color: 'purple'
    },
    customCalendar: {
        height: 250,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    customDay: {
        textAlign: 'center'
    },
    customHeader: {
        backgroundColor: '#eebb8f',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: -4,
        padding: 8
    },
    customTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    customTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00BBF2'
    }
});