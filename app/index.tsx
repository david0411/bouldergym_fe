import {SafeAreaView} from "react-native"
import {Stack} from "expo-router";
import CalendarScreen from "./component/CalendarScreen"

const Home = () => {
    return (
        <SafeAreaView>
            <Stack.Screen/>
            <CalendarScreen/>
        </SafeAreaView>
    )
}
export default Home