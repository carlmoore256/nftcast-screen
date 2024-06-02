import axios from "axios";
import { getApiUrl } from "./constants"; // adjust the path to match your project structure
import type { IContent } from "../../models/types";
import { errorStore } from "../../stores/errorStore";
import { successStore } from "../../stores/successStore";
import type { DisplayLoadData } from "../../models/api-types";
import type { User, Organization, License } from "../../prisma";
import type { DisplayPatch } from "../../models/api-types";

axios.defaults.withCredentials = true;

// runs on load, and gets the data payload for the display
export async function getLoadDataPayload(): Promise<
    DisplayLoadData & {
        user:
            | (Pick<User, "id" | "name" | "email"> & {
                  organization: Pick<Organization, "id" | "name"> & {
                      license: Pick<License, "type">;
                  };
              })
            | null;
    }
> {
    try {
        const response = await axios.get(`${getApiUrl()}/display`);
        return response.data;
    } catch (e) {
        throw new Error("Failed to get load data payload");
    }
}

export async function getCurrentContentForDisplay(deviceId: string): Promise<IContent | null> {
    try {
        const response = await axios.get(`${getApiUrl()}/device/${deviceId}/current-content`);
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
        const response = await axios.get(`${getApiUrl()}/device/${deviceId}/connect`);
        if (response.data.connectionToken !== null) {
            // successStore.set("Connected to server");
            return response.data.connectionToken;
        }
        return null;
    } catch (error) {
        errorStore.set(`Failed to connect to server with device id ${deviceId}`);
        return null;
    }
}

/**
 * @deprecated
 */
export async function getIsAuthenticated(): Promise<boolean> {
    try {
        const response = await axios.get(`${getApiUrl()}/device/is-authenticated`);
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

/**
 * @deprecated
 */
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

export async function deleteDisplay(displayId: string) {
    const res = await fetch(`${getApiUrl()}/display/${displayId}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error("Failed to delete display");
    }
}

export async function refreshDisplay(displayId: string) {
    const res = await fetch(`${getApiUrl()}/display/${displayId}/refresh`);
    if (!res.ok) {
        throw new Error("Failed to refresh display");
    }
}

// gets a token to connect to the websocket
export async function getDisplayToken(): Promise<string> {
    const tokenRes = await fetch(`${getApiUrl()}/display/token`);
    if (!tokenRes.ok) {
        throw new Error("Failed to get display token");
    }
    const { token } = (await tokenRes.json()) as { token: string };
    return token;
}


export async function patchDisplay(displayId: string, data: DisplayPatch) {
    const res = await fetch(`${getApiUrl()}/display/${displayId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error("Failed to update display");
    }
}
