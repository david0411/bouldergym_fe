import {SafeAreaView} from "react-native"
import {Stack, useRouter} from "expo-router";
import CalendarScreen from "./component/CalendarScreen"
import {Button} from "@react-native-material/core";

const Home = () => {
    const router = useRouter();

    return (
        <SafeAreaView>
            <Stack.Screen
            options={{
                headerTitle: '',
                headerRight: () => (
                    <Button title="Add" onPress={() => {
                        router.push({pathname:"/addCalendarItem"})
                    }}/>
                    )
            }}/>
            <CalendarScreen/>
        </SafeAreaView>
    )
}
export default Home