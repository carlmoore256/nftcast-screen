import axios from "axios";
import { getApiUrl } from "./constants"; // adjust the path to match your project structure
import type { IContent } from "../../models/content-types";


export async function getCurrentContentForDevice(deviceId: string) : Promise<IContent> {
    try {
        const response = await axios.get(`${getApiUrl()}/device/${deviceId}/content`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getIsAuthenticated() : Promise<boolean> {
    try {
        const response = await axios.get(`${getApiUrl()}/device/is-authenticated`);
        if (response.data.status === "success") {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
}