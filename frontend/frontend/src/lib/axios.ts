/**
 * File: src/lib/axios.ts
 * Purpose: Shared axios client with auto-refresh and single replay of the failed request.
 * How: On 401, call /auth/refresh with the saved refresh token, set new Authorization, retry once.
 * Docs: Axios interceptors https://axios-http.com/docs/interceptors
 */
import axios, { AxiosError, AxiosInstance } from 'axios';
import { error } from 'console';
import { access } from 'fs';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let accessToken = '';
let refreshToken = '';
let isRefreshing = false;
let waiters: Array<(token: string) => void> = [];

export function setTokens(a: string, r: string) {
    accessToken = a;
    refreshToken = r;
}

export function clearTokens() {
    accessToken = '';
    refreshToken = '';
}

export function createApi(): AxiosInstance {
    const api = axios.create({
        baseURL: API
    });

    api.interceptors.request.use(cfg => {
        if (accessToken) {
            cfg.headers = cfg.headers || {};
            cfg.headers.Authorization = `Bearer ${accessToken}`;
        }
        return cfg;
    });

    api.interceptors.response.use(
        res => res,
        async (error: AxiosError) => {
            const original: any = error.config || {};
            const status = error.response?.status;

            const waitForNewToken = () => new Promise<string>(resolve => waiters.push(resolve));

            if (status === 401 && !original._retry) {
                original._retry = true;

                // if a refresh is already happening, queue behind it
                if (isRefreshing) {
                    const newAccess = await waitForNewToken();
                    original.headers = original.headers || {};
                    original.headers.Authorization = `Bearer ${newAccess}`;
                    return axios(original);
                }

                try {
                    isRefreshing = true;
                    const response = await axios.post(`${API}/auth/refresh`, {
                        refreshToken
                    });
                    const newAccess = (response.data as any).accessToken as string;
                    accessToken = newAccess;

                    // release the queue
                    waiters.forEach(fn => fn(newAccess));
                    waiters = [];
                    isRefreshing = false;

                    // retry the original request
                    original.headers = original.headers || {};
                    original.headers.Authorization = `Bearer ${newAccess}`;
                    return axios(original);
                } catch (err) {
                    isRefreshing = false;
                    waiters = [];
                    clearTokens();
                    throw err;
                }
            }

            throw error;
        }
    );

    return api;
}

export const api = createApi();