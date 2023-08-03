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
                headerTitle: 'Gym Calendar',
                headerRight: () => (
                    <Button title="Add"
                            color="blue"
                            onPress={() => {
                        router.push({pathname:"/addCalendarItem"})
                    }}/>
                    )
            }}/>
            <CalendarScreen/>
        </SafeAreaView>
    )
}
export default Home