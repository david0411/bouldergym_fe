import {SafeAreaView} from "react-native"
import {Stack} from "expo-router";
import CalendarItemDetails from "../component/CalendarItemDetails";

const Details = () => {
    return (
        <SafeAreaView>
            <Stack.Screen/>
            <CalendarItemDetails/>
        </SafeAreaView>
    )
}
export default Details