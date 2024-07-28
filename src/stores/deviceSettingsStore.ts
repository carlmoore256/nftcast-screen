import { writable } from "svelte/store";
import type { IDeviceSettings } from "../models/types";

export const deviceSettingsStore = writable<IDeviceSettings | null>({
    deviceId: null,
    showConsole: true,
});