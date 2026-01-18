const CoinOverviewFallback = () => {
    return (
        <div
            className="h-[120px] rounded-lg bg-dark-400/60 animate-pulse flex items-center gap-4 p-4"
            id="coin-overview-fallback"
        >
            <div className="w-14 h-14 rounded-full bg-dark-300" />

            <div className="space-y-2">
                <div className="h-4 w-32 bg-dark-300 rounded" />
                <div className="h-6 w-40 bg-dark-300 rounded" />
            </div>
        </div>
    );
};

export default CoinOverviewFallback;
