import getEnvConfig from "../config/EnvConfig"
import axios from "axios";
import {EventDto} from "../data/EventDto";

const baseUrl = getEnvConfig().baseUrl;
export const getEventApi = async () =>   {
    try {
        const apiUrl = baseUrl + `/event`
        const response = await axios.get<EventDto[]>(apiUrl)
        return response.data;
    }
    catch(e)    {
        console.error(e);
        throw e;
    }
}