const protocol = "https:";
export const BASE_URL = "api.nftcast.app"
export const PORT = 3000;
export const API_BASE_URL = `${protocol}//${BASE_URL}:${PORT}`;
export const API_WS_URL = `ws://${BASE_URL}:${PORT}`;
export const API_VERSION = 'v1';

export function getApiUrl() {
    return `${API_BASE_URL}/${API_VERSION}`;
}