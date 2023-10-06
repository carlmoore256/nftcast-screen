export interface IContent {
    id: string;
    uri: string;
    name: string | null;
    description: string | null;
    userId: string;
    thumbnailUri: string | null;
    mimetype: string | null;
    transform?: ITransform;
    style?: IStyle;
}

export interface ITransform {
    size: number;
    posX: number;
    posY: number;
    rotation: number;
}

export interface IStyle {
    backgroundColor: string;
}

export interface IDevice {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    transformId: string | null;
    styleId: string | null;
    directoryId: string | null;
}

export interface IDeviceContentPair {
    id?: string;
    deviceId: string;
    contentId: string;
    setupName?: string;
}

export interface IDeviceContentPairConfig {
    deviceContentPairId: string;
    size: number;
    posX: number;
    posY: number;
    rotation: number;
    backgroundColor: string;
}

export interface IPairingCodeResponse {
    // deviceId: string;
    pairingId: string;
    code: string;
}

export interface IPairingStatusResponse {
    status : "pending" | "claimed";
    partial?: number;
    deviceId?: string;
}
