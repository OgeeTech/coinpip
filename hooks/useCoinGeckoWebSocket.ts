'use client';

import { useEffect, useRef, useState } from "react";

/* =======================
    Types
======================= */

export type UseCoinGeckoWebSocketProps = {
    coinId: string;
    poolId?: string;
    liveInterval: '1s' | '1m';
};

export type Trade = {
    p: number; // price
    q: number; // quantity
    t: number; // time
    s: 'buy' | 'sell'; // side
}[];

export type ExtendedPriceData = {
    price: number;
    change24h?: number;
};

// Based on the OHLC format we used in previous components
export type OHLCData = [number, number, number, number, number];

export type UseCoinGeckoWebSocketReturn = {
    price: ExtendedPriceData | null;
    trades: Trade;
    ohlcv: OHLCData | null;
    isWsReady: boolean;
};

/* =======================
    Hook
======================= */

const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_pro_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;

export const useCoinGeckoWebSocket = ({
    coinId,
    poolId,
    liveInterval
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
    const wsRef = useRef<WebSocket | null>(null);
    // Fixed: capital 'S' in Set
    const subscribed = useRef<Set<string>>(new Set());

    const [price, setPrice] = useState<ExtendedPriceData | null>(null);
    const [trades, setTrades] = useState<Trade>([]);
    const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
    const [isWsReady, setIsWsReady] = useState(false);

    useEffect(() => {
        if (!coinId) return;

        const connect = () => {
            const ws = new WebSocket(WS_BASE);
            wsRef.current = ws;

            ws.onopen = () => {
                setIsWsReady(true);
                // Subscribe to the specific coin and interval
                const subscribeMsg = {
                    action: 'subscribe',
                    params: {
                        channel: 'ticker',
                        id: coinId,
                        interval: liveInterval
                    }
                };
                ws.send(JSON.stringify(subscribeMsg));
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);

                // Handle Price Updates
                if (data.type === 'ticker') {
                    setPrice({
                        price: data.p,
                        change24h: data.c24
                    });
                }

                // Handle Trades
                if (data.type === 'trades') {
                    setTrades((prev) => [data, ...prev].slice(0, 20));
                }
            };

            ws.onerror = (error) => console.error("WebSocket Error:", error);

            ws.onclose = () => {
                setIsWsReady(false);
                // Attempt to reconnect after 3 seconds
                setTimeout(connect, 3000);
            };
        };

        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [coinId, liveInterval]);

    return { price, trades, ohlcv, isWsReady };
};