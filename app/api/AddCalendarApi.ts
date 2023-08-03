import getEnvConfig from "../config/EnvConfig";
import axios from "axios/index";
import {GymCalendarDto} from "../data/GymCalendarDto";
import {NewGymCalendarDto} from "../data/NewGymCalendarDto";

const baseUrl = getEnvConfig().baseUrl;
export const addCalendarApi = async (body:NewGymCalendarDto) =>   {
    try {
            const apiUrl = baseUrl + `/calendar/public/add_calendar`
            const response = await axios.put<GymCalendarDto>(apiUrl,body)
            return response.data;
    }
    catch(e)    {
        console.error(e);
        throw e;
    }
}