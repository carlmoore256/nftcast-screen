import axios from "axios";
import { getApiUrl } from "./constants"; // adjust the path to match your project structure
import type { IContent } from "../../models/content-types";

axios.defaults.withCredentials = true;

export async function getCurrentContentForDevice(deviceId: string) : Promise<IContent | null> {
    try {
        const response = await axios.get(`${getApiUrl()}/device/${deviceId}/current-content`);
        return response.data;
    } catch (error) {
        if (error.response.message === "No content found for device") {
            return null;
        }
        // throw error;
    }
}


export async function getConnection(deviceId : string) : Promise<string> {
    try {
        const response = await axios.get(`${getApiUrl()}/device/${deviceId}/connect`);
        if (response.data.connectionToken !== null) {
            return response.data.connectionToken;
        }
        return null;
    } catch (error) {
        throw error;
    }
}

export async function getUpdateStatus(deviceId: string, contentHash: string) : Promise<boolean> {
    try {
        const response = await axios.get(`${getApiUrl()}/device/${deviceId}/updates/${contentHash}`);
        if (response.data.status === "success") {
            return true;
        }
        return false;
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
        // throw error;
        console.log(error);
        return false;
    }
}