import { writable } from "svelte/store";
import type {
    IContent,
    IDevice,
    IStyle,
    ITransform,
    IDeviceSettings,
} from "../models/types";
import { getConnection } from "./api/display";
import { deviceIdStore } from "../stores/deviceIdStore";
import { errorStore } from "../stores/errorStore";
import { isAuthenticated } from "../stores/isAuthenticatedStore";
import { logToConsole } from "./logMessage";
// import { log } from "console";

export const deviceInfoStore = writable<IDevice | null>(null);
export const currentContentStore = writable<IContent | null>(null);
export const currentTransformStore = writable<ITransform | null>(null);
export const currentStyleStore = writable<IStyle | null>(null);
export const deviceSettingsStore = writable<IDeviceSettings | null>({
    deviceId: null,
    showConsole: true,
});

const MAX_RECONNECTION_ATTEMPTS = 1;
const RECONNECTION_DELAY = 500;

let ws: WebSocket;
let reconnectionAttempt = 0;
let deviceId: string = null;

deviceIdStore.subscribe(async (_deviceId) => {
    if (!_deviceId) {
        return;
    }
    deviceId = _deviceId;
    const token = await getConnection(deviceId);
    if (token) {
        connectToWebsocket(token);
    } else {
        errorStore.set("Connection could not be established");
    }
});

function connectToWebsocket(connectionToken: string) {
    ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/${connectionToken}`);
    ws.onopen = handleWebsocketOpen;
    ws.onmessage = handleWebsocketMessage;
    ws.onerror = handleWebsocketError;
    ws.onclose = handleWebsocketClose;
}

function handleWebsocketMessage(event: MessageEvent) {
    try {
        const { key, value } = JSON.parse(event.data);
        console.log(`Received ${key} with value ${JSON.stringify(value)}`);
        switch (key) {
            case "deviceInfo":
                deviceInfoStore.set(value);
                break;
            case "content":
                const { content, transform, style } = value;
                currentTransformStore.set(transform);
                currentContentStore.set(content);
                currentStyleStore.set(style);
                break;
            case "transform":
                currentTransformStore.set(value);
                break;
            case "style":
                currentStyleStore.set(value);
                break;
            case "settings":
                // here we can enable/disable the console
                deviceSettingsStore.set(value);
                // console.log("GOT SETTINGS", value);
                // logToConsole("GOT SETTINGS");
                // logToConsole(JSON.stringify(value));
                break;

            case "deviceDeleted":
                deviceInfoStore.set(null);
                currentContentStore.set(null);
                errorStore.set("Device deleted");
                isAuthenticated.set(false);
                break;
        }
    } catch (error) {
        errorStore.set("Error parsing data from websocket");
    }
}

function handleWebsocketError(event: Event) {
    errorStore.set("WebSocket error with server");
    handleReconnection("onerror");
}

function handleWebsocketOpen(event: Event) {
    // console.log("WebSocket is connected");
    reconnectionAttempt = 0;
    sendDataToWebsocket({ request: "update" });
}

function handleWebsocketClose(event: CloseEvent) {
    console.log("WebSocket is closed", event);
    if (reconnectionAttempt === 0) {
        errorStore.set("Connection closed with server");
    }
    handleReconnection("onclose");
}

export function sendDataToWebsocket(data: any) {
    if (!ws) {
        console.error("WebSocket is not connected");
        return;
    }
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    } else {
        console.error(
            "WebSocket was not open while an attempt to send data was made"
        );
    }
}

async function handleReconnection(referrer?: string) {
    if (reconnectionAttempt > MAX_RECONNECTION_ATTEMPTS) {
        errorStore.set("Max reconnection attempts reached");
        return;
    }
    const connectionToken = await getConnection(deviceId);
    if (connectionToken) {
        console.log(`Reconnection called from referrer: ${referrer}`);
        connectToWebsocket(connectionToken);
        return;
    } else {
        if (reconnectionAttempt === 0) {
            errorStore.set("Connection could not be established");
        }
        setTimeout(async () => {
            console.log(`Reconnecting attempt #${reconnectionAttempt + 1}`);
            handleReconnection("self");
            reconnectionAttempt += 1;
        }, RECONNECTION_DELAY);
        return;
    }
}
