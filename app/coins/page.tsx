import React from 'react';
import Image from 'next/image';
import { fetcher } from '@/lib/coingecko.actions';
import Datatable, { type DataTableColumn } from '@/components/Datatable';
import Pagination from '@/components/ui/pagination';


type CoinData = {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
    total_volume: number;
};

// 1. Update Type: searchParams is a Promise
type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const page = async ({ searchParams }: PageProps) => {
    // 2. Await the searchParams before using them
    const params = await searchParams;

    // 3. Now access the page from the awaited params
    const currentPage = Number(params?.page) || 1;
    const perPage = 10;

    const coins = await fetcher<CoinData[]>(
        `coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${currentPage}&sparkline=false`
    );

    const formatUSD = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    const formatCompact = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);

    const columns: DataTableColumn<CoinData>[] = [
        {
            header: '#',
            cellClassName: 'text-gray-500 w-12 font-medium',
            cell: (coin) => coin.market_cap_rank,
        },
        {
            header: 'Coin',
            cellClassName: 'min-w-[200px]',
            cell: (coin) => (
                <div className="flex items-center gap-3">
                    <Image
                        src={coin.image}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{coin.name}</span>
                        <span className="text-xs text-gray-500 uppercase">{coin.symbol}</span>
                    </div>
                </div>
            ),
        },
        {
            header: 'Price',
            cellClassName: 'text-right font-medium',
            cell: (coin) => formatUSD(coin.current_price),
        },
        {
            header: '24h Change',
            cellClassName: 'text-right',
            cell: (coin) => {
                const change = coin.price_change_percentage_24h;
                const isPositive = change >= 0;
                return (
                    <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                    </span>
                );
            },
        },
        {
            header: '24h Volume',
            cellClassName: 'text-right hidden md:table-cell',
            cell: (coin) => formatCompact(coin.total_volume),
        },
        {
            header: 'Market Cap',
            cellClassName: 'text-right font-medium',
            cell: (coin) => formatCompact(coin.market_cap),
        },
    ];

    return (
        <div className="w-full">

            <h2 className="text-2xl font-bold mb-6">Cryptocurrency Prices by Market Cap</h2>

            <div className="custom-scrollbar overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
                <Datatable
                    columns={columns}
                    data={coins || []}
                    rowKey={(row) => row.id}
                    tableClassName="w-full text-sm text-left rtl:text-right text-gray-500"
                />
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={100}
            />
        </div>
    );
};

export default page;