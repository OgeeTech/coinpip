import React from 'react'

const CoinOverview = () => {
    return (

        <div id="coin-overview">
            <div className="header pt-2 flex items-center gap-3">
                <Image
                    src={coin.image.large}
                    alt={coin.name}
                    width={56}
                    height={56}
                />
                <div className="info">
                    <p>
                        {coin.name} / {coin.symbol.toUpperCase()}
                    </p>
                    <h1>
                        ${coin.market_data.current_price.usd.toLocaleString()}
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default CoinOverview
