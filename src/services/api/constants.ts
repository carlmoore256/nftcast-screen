export const BASE_URL = 'localhost';
export const PORT = 3000;
export const API_BASE_URL = `http://${BASE_URL}:${PORT}`;
export const API_WS_URL = `ws://${BASE_URL}:${PORT}`;
export const API_VERSION = 'v1';

export function getApiUrl() {
    return `${API_BASE_URL}/${API_VERSION}`;
}