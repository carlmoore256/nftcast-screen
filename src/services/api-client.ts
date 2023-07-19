// const API_BASE_URL = 'https://api.nftcast.app:3000/v1';
const API_BASE_URL = 'http://localhost:3000';
const API_VERSION = 'v1';

export class APIClient {
    constructor(public baseUrl : string = API_BASE_URL) {}
  
    async get<T>(endpoint : string, params?: Record<string, string>, requestInit? : Partial<RequestInit>) : Promise<T> {
      const url = new URL(`${API_VERSION}/` + endpoint, this.baseUrl);
      url.search = new URLSearchParams(params).toString();
  
      const response = await fetch(url.toString(), {
        method: 'GET',
        ...requestInit
      });
  
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
  
      return await response.json() as T;
    }

    async post<T>(endpoint : string, data : Record<string, string>) : Promise<T> {
        const url = new URL(`${this.baseUrl}/${endpoint}`);
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        return await response.json() as T;
    }
  
    // similar methods for post, put, delete...
  }
  