import axios from "axios";
import { getApiUrl } from "./constants"; // adjust the path to match your project structure
import type { IPairingCodeResponse, IPairingStatusResponse } from "../../models/pairing-types";

export async function getPairingStatus(code: string) : Promise<IPairingStatusResponse> {
    try {
        const response = await axios.get(`${getApiUrl()}/pair/status/${code}`);
        return response.data;
    } catch (error) {
        console.error(`Error checking pairing status: ${error}`);
        throw error;
    }
};

export async function getPairingCode() : Promise<IPairingCodeResponse> {
    try {
        const response = await axios.get(`${getApiUrl()}/pair/get-code`);
        return response.data;
    } catch (error) {
        console.error(`Error getting pairing code: ${error}`);
        throw error;
    }
};
