import axios, {
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

import Cookies from "js-cookie";

import { BASE_ADMIN } from "@/config";

const api = axios.create({
    baseURL: BASE_ADMIN,

    headers: {
        "Content-Type": "application/json",
    },

    withCredentials: true,
});

/* ======================================================
   REQUEST INTERCEPTOR
====================================================== */

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken =
            Cookies.get("accessToken");

        // Attach Bearer Token
        if (accessToken) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);

/* ======================================================
   TOKEN REFRESH LOGIC
====================================================== */

let isRefreshing = false;

let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
}[] = [];

const processQueue = (
    error: AxiosError | null,
    token: string | null = null
) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });

    failedQueue = [];
};

/* ======================================================
   RESPONSE INTERCEPTOR
====================================================== */

api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError<any>) => {
        const originalRequest: any = error.config;

        // Skip if no response
        if (!error.response) {
            return Promise.reject(error);
        }

        // Access token expired
        if (error.response.status === 401) {
            // If already retried, just logout and redirect
            if (originalRequest._retry) {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                if (typeof window !== "undefined") {
                    window.location.href = "/admin/login";
                }
                return Promise.reject(error);
            }

            // Avoid infinite loop
            originalRequest._retry = true;

            /* =========================================
               IF REFRESH ALREADY RUNNING
            ========================================= */

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization =
                                `Bearer ${token}`;

                            resolve(api(originalRequest));
                        },

                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshToken =
                    Cookies.get("refreshToken");

                // No refresh token
                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                /* =========================================
                   REFRESH API
                ========================================= */

                const response = await axios.post(
                    `${BASE_ADMIN}/admin/auth/refresh`,
                    {
                        refreshToken,
                    },
                    {
                        withCredentials: true,
                    }
                );

                const newAccessToken =
                    response.data.data.accessToken;

                /* =========================================
                   SAVE NEW TOKEN
                ========================================= */

                Cookies.set(
                    "accessToken",
                    newAccessToken,
                    {
                        expires: 1,
                        secure:
                            process.env.NODE_ENV ===
                            "production",

                        sameSite: "Lax",
                    }
                );

                /* =========================================
                   UPDATE HEADER
                ========================================= */

                api.defaults.headers.common.Authorization =
                    `Bearer ${newAccessToken}`;

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);

                return api(originalRequest);
            } catch (refreshError: any) {
                processQueue(refreshError, null);

                /* =========================================
                   LOGOUT USER
                ========================================= */

                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");

                if (typeof window !== "undefined") {
                    window.location.href =
                        "/admin/login";
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;