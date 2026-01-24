import { useEffect, useRef, useState } from "react"


const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_pro_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;

export const useCoinGeckoWebSocket = ({
    coinId,
    poolId,
    liveInterval
}: useCoinGeckoWebSocketProps): useCoinGeckoWebSocketReturn => {
    const wsRef = useRef<WebSocket | null>(null);
    const subscribed = useRef
        (<Set<string>>new set());


    const [price, setPrice] = useState<ExtendedPriceData | null>(null);
    const [trades, setTrades] = useState<Trade>([]);
    const [ohlcv, setohlcv] = useState<OHLCData | null>(null);

    const [isWsReady, setIswsReady] = useState(false);

    useEffect(() => {

    }, [])
}