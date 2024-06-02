import axios from "axios";
import { getApiUrl } from "./constants"; // adjust the path to match your project structure
import type { IPairingCodeResponse, IPairingStatusResponse } from "../../models/types";
import { errorStore } from "../../stores/errorStore";
import { successStore } from "../../stores/successStore";

axios.defaults.withCredentials = true;

export async function getPairingStatus(code: string): Promise<{
    status: "claimed" | "unclaimed";
}> {
    try {
        const response = await axios.get(`${getApiUrl()}/pair/status/${code}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        errorStore.set(`Error checking pairing status: ${error}`);
        throw error;
    }
}

export async function getPairingCode(): Promise<IPairingCodeResponse> {
    try {
        const response = await axios.get(`${getApiUrl()}/pair/get-code`);
        return response.data;
    } catch (error) {
        errorStore.set(`Error getting pairing code: ${error}`);
        throw error;
    }
}
