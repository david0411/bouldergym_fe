import getEnvConfig from "../config/EnvConfig"
import axios from "axios";
import {GymCalendarDto} from "../data/GymCalendarDto";

const baseUrl = getEnvConfig().baseUrl;
export const getCalendarApi = async (year: string, month: string) =>   {
    try {
        if(year && month)   {
            const apiUrl = baseUrl + `/calendar/public/`+ year + `/` + month
            const response = await axios.get<GymCalendarDto[]>(apiUrl)
            return response.data;
        }
    }
    catch(e)    {
        console.error(e);
        throw e;
    }
}