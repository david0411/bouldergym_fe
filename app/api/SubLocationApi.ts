import getEnvConfig from "../config/EnvConfig"
import axios from "axios";
import {SubLocationDto} from "../data/SubLocationDto";

const baseUrl = getEnvConfig().baseUrl;
export const getSubLocationApi = async () =>   {
    try {
        const apiUrl = baseUrl + `/sub`
        const response = await axios.get<SubLocationDto[]>(apiUrl)
        return response.data;
    }
    catch(e)    {
        console.error(e);
        throw e;
    }
}