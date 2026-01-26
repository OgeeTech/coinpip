'use client';

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Datatable from "@/components/Datatable";
import { fetcher } from "@/lib/coingecko.actions";

/* =======================
   Types
======================= */

type TrendingCoinItem = {
    item: {
        id: string;
        name: string;
        large: string;
        symbol: string;
        data: {
            price: number;
            price_change_percentage_24h: {
                usd: number;
            };
        };
    };
};

type TrendingCoinsResponse = {
    coins: TrendingCoinItem[];
};

type TrendingCoinsProps = {
    onSelect?: (id: string) => void;
    activeCoinId?: string;
};

/* =======================
   Component
======================= */

const TrendingCoins = ({ onSelect, activeCoinId }: TrendingCoinsProps) => {
    const [data, setData] = useState<TrendingCoinItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch trending coins on mount
    useEffect(() => {
        const getTrending = async () => {
            try {
                setIsLoading(true);
                const res = await fetcher<TrendingCoinsResponse>("search/trending");
                if (res && res.coins) {
                    setData(res.coins.slice(0, 6));
                }
            } catch (error) {
                console.error("Error fetching trending coins:", error);
            } finally {
                setIsLoading(false);
            }
        };
        getTrending();
    }, []);

    const columns = [
        {
            header: "Name",
            cell: (coin: TrendingCoinItem) => {
                const item = coin.item;
                const isActive = activeCoinId === item.id;

                return (
                    <button
                        onClick={() => onSelect?.(item.id)}
                        className={cn(
                            "flex items-center gap-3 transition-all duration-200 text-left group",
                            isActive ? "text-green-500 font-bold" : "text-gray-300 hover:text-white"
                        )}
                    >
                        <div className={cn(
                            "relative p-0.5 rounded-full transition-transform group-hover:scale-110",
                            isActive ? "bg-green-500/20 ring-2 ring-green-500" : "bg-transparent"
                        )}>
                            <Image
                                src={item.large}
                                alt={item.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm leading-none">{item.name}</p>
                            <span className="text-[10px] uppercase text-gray-500 mt-1">{item.symbol}</span>
                        </div>
                    </button>
                );
            },
        },
        {
            header: "Price",
            cell: (coin: TrendingCoinItem) => (
                <p className="font-medium text-xs text-gray-200">
                    ${coin.item.data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </p>
            ),
        },
        {
            header: "24h Change",
            cell: (coin: TrendingCoinItem) => {
                const change = coin.item.data.price_change_percentage_24h.usd;
                const isUp = change > 0;

                return (
                    <div
                        className={cn(
                            "flex items-center gap-1 text-xs font-semibold",
                            isUp ? "text-green-500" : "text-red-500"
                        )}
                    >
                        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{Math.abs(change).toFixed(2)}%</span>
                    </div>
                );
            },
        },
    ];

    if (isLoading) {
        return (
            <div className="bg-dark-400 border border-dark-300 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin mb-2" />
                <p className="text-gray-500 text-sm animate-pulse">Scanning the market...</p>
            </div>
        );
    }

    return (
        <div id="trending-coins" className="bg-dark-400 border border-dark-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4 px-2">
                <h4 className="font-bold text-lg text-white tracking-tight">Trending Coins</h4>
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" title="Live updates" />
            </div>

            <Datatable
                data={data}
                columns={columns}
                rowKey={(row) => row.item.id}
                tableClassName="w-full"
                headerCellClassName="text-gray-500 text-[10px] uppercase tracking-wider py-2 font-bold border-b border-dark-300"
                bodyCellClassName="py-3 border-b border-white/5 last:border-0"
            />

            <p className="mt-4 text-[10px] text-center text-gray-600 italic">
                Click a coin to update the overview chart
            </p>
        </div>
    );
};

export default TrendingCoins;