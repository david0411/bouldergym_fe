import {SafeAreaView, View} from "react-native"
import {Stack, useRouter} from "expo-router";
import {ScrollView} from "react-native-web";
import CalendarScreen from "./component/CalendarScreen"

const Home = () => {
    const router = useRouter()
    return (
        <SafeAreaView>
            <Stack.Screen/>
            <CalendarScreen/>
        </SafeAreaView>
    )
}
export default Home