import { Suspense } from "react";
import CoinOverview from "@/components/home/CoinOverview";
import TrendingCoins from "@/components/home/TrendingCoin";
import {
    CoinOverviewFallback,
    TrendingCoinFallback,
} from "@/components/home/fallback";

const Page = async () => {
    return (
        <main className="main-container">
            <section className="home-grid">
                <Suspense fallback={<CoinOverviewFallback />}>
                    <CoinOverview />
                </Suspense>

                <Suspense fallback={<TrendingCoinFallback />}>
                    <TrendingCoins />
                </Suspense>
            </section>

            <section className="w-full mt-7 space-y-4">
                <p>Categories</p>
            </section>
        </main>
    );
};

export default Page;
