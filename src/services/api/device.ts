import axios from "axios";
import { getApiUrl } from "./constants"; // adjust the path to match your project structure
import type { IContent } from "../../models/types";
import { errorStore } from "../../stores/errorStore";
import { successStore } from "../../stores/successStore";

axios.defaults.withCredentials = true;

export async function getCurrentContentForDevice(
    deviceId: string
): Promise<IContent | null> {
    try {
        const response = await axios.get(
            `${getApiUrl()}/device/${deviceId}/current-content`
        );
        successStore.set("Content found for device");
        return response.data;
    } catch (error) {
        errorStore.set(`No content found for device ${deviceId}`);
        if (error.response.message === "No content found for device") {
            return null;
        }
    }
}

export async function getConnection(deviceId: string): Promise<string> {
    try {
        const response = await axios.get(
            `${getApiUrl()}/device/${deviceId}/connect`
        );
        if (response.data.connectionToken !== null) {
            // successStore.set("Connected to server");
            return response.data.connectionToken;
        }
        return null;
    } catch (error) {
        errorStore.set(`Failed to connect to server with device id ${deviceId}`);
        throw error;
    }
}

export async function getIsAuthenticated(): Promise<boolean> {
    try {
        const response = await axios.get(
            `${getApiUrl()}/device/is-authenticated`
        );
        if (response.data.status === "success") {
            successStore.set("Authentication successful");
            return true;
        }
        return false;
    } catch (error) {
        errorStore.set("Authentication failed");
        return false;
    }
}

export async function renewCookie(deviceId: string): Promise<boolean> {
    try {
        const response = await axios.get(`${getApiUrl()}/device/${deviceId}/renew-cookie`);
        if (response.data.status === "success") {
            successStore.set("Cookie renewed");
            return true;
        }
        return false;
    } catch (error) {
        errorStore.set("Failed to renew cookie");
        return false;
    }
}
