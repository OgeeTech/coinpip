import React from 'react';
import Image from 'next/image';
import { fetcher } from '@/lib/coingecko.actions';
import Datatable, { DataTableColumn } from '../Datatable';

// 1. Updated Type to include market data fields
type Category = {
    id: string;
    name: string;
    top_3_coins: string[];
    market_cap: number;
    market_cap_change_24h: number;
    volume_24h: number;
};

const Categories = async () => {
    const categories = await fetcher<Category[]>('coins/categories');

    // Helper for formatting currency (e.g. $1.2B)
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(value);
    };

    const columns: DataTableColumn<Category>[] = [
        {
            header: 'Category',
            cellClassName: 'category-cell font-medium', // Added font-medium for emphasis
            cell: (category) => category.name,
        },
        {
            header: 'Top Gainers',
            cellClassName: 'Top-gainers-cell',
            cell: (category) => (
                <div className="flex gap-2">
                    {category.top_3_coins?.map((coin) => (
                        <Image
                            src={coin}
                            alt={`${category.name} top coin`}
                            key={coin}
                            width={28}
                            height={28}
                            className="rounded-full"
                        />
                    ))}
                </div>
            ),
        },
        // --- NEW COLUMNS START ---
        {
            header: '24h Change',
            cellClassName: 'change-cell',
            cell: (category) => {
                const change = category.market_cap_change_24h;
                const isPositive = change >= 0;

                return (
                    <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                        {isPositive ? '+' : ''}{change?.toFixed(2)}%
                    </span>
                );
            },
        },
        {
            header: 'Market Cap',
            cellClassName: 'market-cap-cell text-right', // Right align numbers
            cell: (category) => formatCurrency(category.market_cap),
        },
        {
            header: '24h Volume',
            cellClassName: 'volume-cell text-right', // Right align numbers
            cell: (category) => formatCurrency(category.volume_24h),
        }
        // --- NEW COLUMNS END ---
    ];

    return (
        <div id="categories" className="custom-scrollbar">
            <h4 className="mb-4 text-xl font-bold">Top Categories</h4>

            <Datatable
                columns={columns}
                // Ensure we have data before slicing
                data={categories ? categories.slice(0, 10) : []}
                rowKey={(row) => row.id}
                tableClassName="mt-3 w-full" // Ensure table takes full width
            />
        </div>
    );
};

export default Categories;