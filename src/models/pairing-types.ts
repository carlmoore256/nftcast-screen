export interface IPairingCodeResponse {
    deviceId: string;
    code: string;
}

export interface IPairingStatusResponse {
    status : "pending" | "claimed";
}