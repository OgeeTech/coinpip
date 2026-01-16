import { Coins } from 'lucide-react'
import React from 'react'

const TrendingCoin = async () => {
    const trendingCoins = await fetcher<{
        coins: TrendingCoin[]
    }>
        ('/serach/trending', undefined, 300);
}
const columns = [
    {
        header: "Name",
        cell: (coin: TrendingCoin) => {
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
        cell: (coin: TrendingCoin) => (
            <p className="font-medium">
                ${coin.item.data.price.toLocaleString()}
            </p>
        ),
    },
    {
        header: "24h Change",
        cell: (coin: TrendingCoin) => {
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
    <>
        <p className="mt-4 font-semibold">Trending Coins</p>
        <div id='trending-coins'>
            <Datatable
                columns={columns}
                data={[]} // replace later with trending endpoint
                rowKey={(row) => row.item.id}
            />
            <tableClassName='trending-coin-table'
        </div>
    </>
)
}

export default TrendingCoin


