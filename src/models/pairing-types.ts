export interface IPairingCodeResponse {
    // deviceId: string;
    pairingId: string;
    code: string;
}

export interface IPairingStatusResponse {
    status : "pending" | "claimed";
}