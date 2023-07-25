import axios from "axios";
import { getApiUrl } from "./constants";
import type { IDeviceContentPair, IDeviceContentPairConfig } from "../../models/types";

const route = "/cast";
const url = `${getApiUrl()}${route}`;

axios.defaults.withCredentials = true;

const getDeviceContentPairConfig = async (id: string): Promise<IDeviceContentPairConfig> => {
    try {
        const res = await axios.get(`${url}/content-pair/${id}/config`);
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};


export {
    getDeviceContentPairConfig,
};
