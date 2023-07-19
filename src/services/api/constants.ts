export const API_BASE_URL = 'http://localhost:3000';
export const API_VERSION = 'v1';

export function getApiUrl() {
    return `${API_BASE_URL}/${API_VERSION}`;
}