import {SafeAreaView, View} from "react-native"
import {Link, Stack, useRouter} from "expo-router";
import CalendarScreen from "./component/CalendarScreen"
import {Button} from "@react-native-material/core";

const Home = () => {
    const router = useRouter();

    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    headerTitle: 'Gym Calendar',
                    headerTitleAlign:   'center',
                    headerLeft: () => (
                        <Link href="/component/LocationFilter" asChild>
                            <Button title="Filter" color="blue" />
                        </Link>
                    ),
                    headerRight: () => (
                        <Link href="/component/addCalendarItem" asChild>
                            <Button title="Add" color="blue" />
                        </Link>
                    )
                }}/>
            <View style={{margin: "5%"}}>
                <CalendarScreen/>
            </View>
        </SafeAreaView>
    )
}
export default Home