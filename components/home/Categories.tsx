'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetcher } from '@/lib/coingecko.actions';
import Datatable, { DataTableColumn } from '../Datatable';
import { cn } from '@/lib/utils';

type Category = {
    id: string;
    name: string;
    top_3_coins: string[];
    market_cap: number;
    market_cap_change_24h: number;
    volume_24h: number;
};

const Categories = ({ onSelect }: { onSelect: (id: string) => void }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const load = async () => {
            const res = await fetcher<Category[]>('coins/categories');
            if (res) setCategories(res.slice(0, 10));
        };
        load();
    }, []);

    // Helper to extract Coin ID from CoinGecko Image URL
    // URL format: https://assets.coingecko.com/coins/images/1/large/bitcoin.png
    const getCoinIdFromUrl = (url: string) => {
        const parts = url.split('/');
        const fileName = parts[parts.length - 1]; // bitcoin.png
        return fileName.split('.')[0]; // bitcoin
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1,
        }).format(value);
    };

    const columns: DataTableColumn<Category>[] = [
        {
            header: 'Category',
            cellClassName: 'category-cell font-medium text-white',
            cell: (category) => category.name,
        },
        {
            header: 'Click Coin to View Chart',
            cell: (category) => (
                <div className="flex gap-3">
                    {category.top_3_coins?.map((coinUrl, i) => {
                        const coinId = getCoinIdFromUrl(coinUrl);
                        return (
                            <button
                                key={i}
                                onClick={() => onSelect(coinId)}
                                className="relative hover:scale-125 transition-transform duration-200 hover:ring-2 hover:ring-green-500 rounded-full p-0.5 bg-dark-300"
                                title={`View ${coinId} chart`}
                            >
                                <Image
                                    src={coinUrl}
                                    alt={coinId}
                                    width={28}
                                    height={28}
                                    className="rounded-full"
                                />
                            </button>
                        );
                    })}
                </div>
            ),
        },
        {
            header: '24h Change',
            cell: (category) => {
                const change = category.market_cap_change_24h;
                return (
                    <span className={cn(
                        "font-semibold",
                        change >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                        {change > 0 ? '+' : ''}{change?.toFixed(2)}%
                    </span>
                );
            },
        },
        {
            header: 'Market Cap',
            cell: (category) => (
                <span className="text-gray-300">
                    {formatCurrency(category.market_cap)}
                </span>
            ),
        }
    ];

    return (
        <div id="categories" className="custom-scrollbar bg-dark-400 p-6 rounded-xl border border-dark-300 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-white">Market Sectors</h4>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    Top 10 by Market Cap
                </span>
            </div>

            <Datatable
                columns={columns}
                data={categories}
                rowKey={(row) => row.id}
                tableClassName="mt-3 w-full"
                headerCellClassName="text-gray-500 text-[11px] uppercase py-3 border-b border-dark-300"
                bodyCellClassName="py-4 border-b border-white/5"
            />
        </div>
    );
};

export default Categories;