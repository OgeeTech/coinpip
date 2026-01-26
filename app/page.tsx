'use client';

import { useState } from "react";
import CoinOverview from "@/components/home/CoinOverview";
import TrendingCoins from "@/components/home/TrendingCoin";
import Categories from "@/components/home/Categories";
import {
    CoinOverviewFallback,
    TrendingCoinFallback
} from "@/components/home/fallback";

const Page = () => {
    // Shared state: Chart will listen to this ID
    const [activeCoinId, setActiveCoinId] = useState("bitcoin");

    return (
        <main className="main-container">
            <section className="home-grid">
                {/* We pass the activeCoinId to the overview chart */}
                <CoinOverview coinId={activeCoinId} />

                {/* Pass the setter function to handle clicks */}
                <TrendingCoins onSelect={setActiveCoinId} activeCoinId={activeCoinId} />
            </section>

            <section className="w-full mt-7 space-y-4">
                <Categories onSelect={setActiveCoinId} />
            </section>
        </main>
    );
};

export default Page;