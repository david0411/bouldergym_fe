import getEnvConfig from "../config/EnvConfig"
import axios from "axios";
import {LocationDto} from "../data/LocationDto";

const baseUrl = getEnvConfig().baseUrl;
export const getLocationApi = async () =>   {
    try {
            const apiUrl = baseUrl + `/gym`
            const response = await axios.get<LocationDto[]>(apiUrl)
            return response.data;
    }
    catch(e)    {
        console.error(e);
        throw e;
    }
}