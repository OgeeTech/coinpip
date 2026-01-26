import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Added Link
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

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const page = async ({ searchParams }: PageProps) => {
    const params = await searchParams;
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
                <Link href={`/?coin=${coin.id}`} className="flex items-center gap-3 group">
                    <Image
                        src={coin.image}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className="rounded-full transition-transform group-hover:scale-110"
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-green-500 transition-colors">{coin.name}</span>
                        <span className="text-xs text-gray-500 uppercase">{coin.symbol}</span>
                    </div>
                </Link>
            ),
        },
        {
            header: 'Price',
            cellClassName: 'text-right font-medium text-white',
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
            header: 'Market Cap',
            cellClassName: 'text-right font-medium text-gray-300',
            cell: (coin) => formatCompact(coin.market_cap),
        },
    ];

    return (
        <div className="w-full bg-dark-400 p-6 rounded-xl border border-dark-300">
            <h2 className="text-2xl font-bold mb-6 text-white">Cryptocurrency Prices</h2>

            <div className="custom-scrollbar overflow-x-auto">
                <Datatable
                    columns={columns}
                    data={coins || []}
                    rowKey={(row) => row.id}
                    tableClassName="w-full text-sm text-left text-gray-400"
                />
            </div>

            <div className="mt-8 flex justify-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={100}
                />
            </div>
        </div>
    );
};

export default page;