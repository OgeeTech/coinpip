"use server";

import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;

// FREE plan → NO API KEY REQUIRED
if (!BASE_URL) {
    throw new Error("COINGECKO_BASE_URL is missing");
}

export async function fetcher<T>(
    endpoint: string,
    params?: Record<string, any>,
    revalidate = 60
): Promise<T> {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_URL}/${endpoint}`,
            query: params,
        },
        {
            skipNull: true,
            skipEmptyString: true,
        }
    );

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
        },
        next: { revalidate },
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
            `API Error: ${response.status}: ${errorBody?.error || response.statusText
            }`
        );
    }

    return response.json();
}
