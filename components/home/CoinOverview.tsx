import Image from "next/image";
import { fetcher } from "@/lib/coingecko.actions";
import CoinOverviewFallback from "@/components/home/CoinOverviewFallback";
import CandlestickChart from "@/components/CandlestickChart";

/* =======================
   Types
======================= */

type CoinDetails = {
    name: string;
    symbol: string;
    image: {
        large: string;
    };
    market_data: {
        current_price: {
            usd: number;
        };
    };
};

export type OHLCData = [
    number, // timestamp
    number, // open
    number, // high
    number, // low
    number  // close
];

/* =======================
   Component
======================= */

const CoinOverview = async () => {
    try {
        const [coin, coinOHLCData] = await Promise.all([
            fetcher<CoinDetails>("coins/bitcoin"),
            fetcher<OHLCData[]>("coins/bitcoin/ohlc", {
                vs_currency: "usd",
                days: 1,
            }),
        ]);

        return (
            <div id="coin-overview" className="space-y-4">
                <CandlestickChart data={coinOHLCData} coinId="bitcoin">
                    <div className="header pt-2 flex items-center gap-3">
                        <Image
                            src={coin.image.large}
                            alt={coin.name}
                            width={56}
                            height={56}
                            priority
                        />

                        <div className="info">
                            <p className="text-sm opacity-70">
                                {coin.name} / {coin.symbol.toUpperCase()}
                            </p>

                            <h1 className="text-2xl font-semibold">
                                ${coin.market_data.current_price.usd.toLocaleString()}
                            </h1>
                        </div>
                    </div>
                </CandlestickChart>
            </div>
        );
    } catch (error) {
        console.error("CoinOverview error:", error);
        return <CoinOverviewFallback />;
    }
};

export default CoinOverview;
