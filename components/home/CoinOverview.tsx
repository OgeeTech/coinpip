'use client';

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { fetcher } from "@/lib/coingecko.actions";
import { CoinOverviewFallback } from "@/components/home/fallback";
import CandlestickChart from "@/components/CandlestickChart";
import { Loader2 } from "lucide-react";

type CoinDetails = {
    name: string;
    symbol: string;
    image: { large: string };
    market_data: {
        current_price: { usd: number };
    };
};

export type OHLCData = [number, number, number, number, number];

const CoinOverview = ({ coinId }: { coinId: string }) => {
    const [data, setData] = useState<{ coin: CoinDetails; ohlc: OHLCData[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [coin, ohlc] = await Promise.all([
                    fetcher<CoinDetails>(`coins/${coinId}`),
                    fetcher<OHLCData[]>(`coins/${coinId}/ohlc`, {
                        vs_currency: "usd",
                        days: 1,
                    }),
                ]);

                if (coin && ohlc) {
                    setData({ coin, ohlc });
                }
            } catch (error) {
                console.error("CoinOverview fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [coinId]);

    if (isLoading && !data) return <CoinOverviewFallback />;
    if (!data) return null;

    return (
        <div id="coin-overview" className="relative space-y-4">
            {/* The Loader2 only shows when the ID has changed and new data is fetching */}
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-dark-400/50 backdrop-blur-[1px] rounded-lg">
                    <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
                </div>
            )}

            {/* PASSING THE DATA: 
               The children inside CandlestickChart will now reflect 
               the NEW name and symbol from the 'data' state.
            */}
            <CandlestickChart data={data.ohlc} coinId={coinId}>
                <div className="header pt-2 flex items-center gap-3">
                    <Image
                        src={data.coin.image.large}
                        alt={data.coin.name}
                        width={56}
                        height={56}
                        priority
                        className="rounded-full"
                    />

                    <div className="info">
                        <div className="flex items-center gap-2">
                            {/* This is the dynamic name that will change */}
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                                {data.coin.name}
                            </h2>
                            <span className="text-xs bg-dark-200 text-gray-400 px-2 py-0.5 rounded uppercase font-bold">
                                {data.coin.symbol} / USD
                            </span>
                        </div>

                        <h1 className="text-3xl font-mono font-bold text-white mt-1">
                            ${data.coin.market_data.current_price.usd.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </h1>
                    </div>
                </div>
            </CandlestickChart>
        </div>
    );
};

export default CoinOverview;