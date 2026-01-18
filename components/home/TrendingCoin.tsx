import Image from "next/image";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Datatable from "@/components/Datatable";
import { fetcher } from "@/lib/coingecko.actions";

type TrendingCoinItem = {
    item: {
        id: string;
        name: string;
        large: string;
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

const TrendingCoins = async () => {
    // Fetch top trending coins (free plan, server-side)
    const trendingCoins = await fetcher<TrendingCoinsResponse>(
        "search/trending",
        undefined,
        300
    );

    const columns = [
        {
            header: "Name",
            cell: (coin: TrendingCoinItem) => {
                const item = coin.item;
                return (
                    <Link href={`/coins/${item.id}`} className="flex items-center gap-3">
                        <Image src={item.large} alt={item.name} width={36} height={36} />
                        <p className="font-medium">{item.name}</p>
                    </Link>
                );
            },
        },
        {
            header: "Price",
            cell: (coin: TrendingCoinItem) => (
                <p className="font-medium">
                    ${coin.item.data.price.toLocaleString()}
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
                            "flex items-center gap-1 font-medium",
                            isUp ? "text-green-500" : "text-red-500"
                        )}
                    >
                        {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{change.toFixed(2)}%</span>
                    </div>
                );
            },
        },
    ];

    return (
        <div id="trending-coins">
            <h4 className="font-semibold mb-2">Trending Coins</h4>
            <Datatable
                data={trendingCoins.coins.slice(0, 6) || []}
                columns={columns}
                rowKey={(row) => row.item.id}
                tableClassName="trending-coins-table"
                headerCellClassName="py-3!"
                bodyCellClassName="py-2!"
            />
        </div>
    );
};

export default TrendingCoins;
