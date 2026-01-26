'use client';

import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';

import {
  createChart,
  CandlestickSeries,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
} from 'lightweight-charts';

import { PERIOD_BUTTONS, PERIOD_CONFIG, type Period } from '@/constant';
import { fetcher } from '@/lib/coingecko.actions';
import { Search, Loader2 } from 'lucide-react'; // Assuming you have lucide-react

export type OHLCData = [
  number, // timestamp (ms)
  number, // open
  number, // high
  number, // low
  number  // close
];

type Props = {
  coinId: string; // This acts as the initial default
  data?: OHLCData[];
  height?: number;
  initialPeriod?: Period;
  children?: ReactNode;
};

const CandlestickChart = ({
  children,
  data = [],
  coinId: initialCoinId,
  height = 360,
  initialPeriod = 'weekly',
}: Props) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // States
  const [currentCoinId, setCurrentCoinId] = useState(initialCoinId);
  const [searchInput, setSearchInput] = useState('');
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  /* =======================
     Fetching Logic
  ======================= */

  const fetchOHLCData = async (targetId: string, selectedPeriod: Period) => {
    const config = PERIOD_CONFIG[selectedPeriod];
    if (!config) return [];

    setIsLoading(true);
    try {
      const response = await fetcher<OHLCData[]>(
        `coins/${targetId.toLowerCase()}/ohlc`,
        {
          vs_currency: 'usd',
          days: config.days,
          precision: 'full',
        }
      );
      return response ?? [];
    } catch (error) {
      console.error("Failed to fetch OHLC data:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================
     Handlers
  ======================= */

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    if (!query || query === currentCoinId) return;

    startTransition(async () => {
      const newData = await fetchOHLCData(query, period);
      if (newData.length > 0) {
        setCurrentCoinId(query);
        setOhlcData(newData);
      }
    });
  };

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;

    startTransition(async () => {
      const newData = await fetchOHLCData(currentCoinId, newPeriod);
      setPeriod(newPeriod);
      setOhlcData(newData);
    });
  };

  /* =======================
     Chart Effects
  ======================= */

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: { background: { color: 'transparent' }, textColor: '#c7c7c7' },
      grid: { vertLines: { color: '#1f2933' }, horzLines: { color: '#1f2933' } },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e', downColor: '#ef4444',
      borderUpColor: '#22c55e', borderDownColor: '#ef4444',
      wickUpColor: '#22c55e', wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length) chart.applyOptions({ width: entries[0].contentRect.width });
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [height]);

  useEffect(() => {
    if (!candleSeriesRef.current) return;

    const formattedData = ohlcData.map(([time, open, high, low, close]) => ({
      time: Math.floor(time / 1000) as UTCTimestamp,
      open, high, low, close,
    }));

    candleSeriesRef.current.setData(formattedData);
    chartRef.current?.timeScale().fitContent();
  }, [ohlcData]);

  return (
    <div className="rounded-lg border border-dark-300 bg-dark-400 p-4 space-y-4 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* Search Input Section */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search coin (e.g. bitcoin, solana)..."
            className="w-full bg-dark-200 border border-dark-300 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-white"
          />
          {(isLoading || isPending) && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-green-500" />
          )}
        </form>

        {/* Period Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {PERIOD_BUTTONS.map(({ value, label }) => {
            const isActive = period === value;
            return (
              <button
                key={value}
                onClick={() => handlePeriodChange(value as Period)}
                disabled={isPending || isLoading}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all
                  ${isActive
                    ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                    : 'bg-dark-200 text-gray-400 hover:bg-dark-300 hover:text-white'
                  }
                  ${(isPending || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Asset Info */}
      <div className="flex items-center gap-2 px-1">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">
          {currentCoinId} <span className="text-gray-500 font-normal">/ USD</span>
        </h2>
      </div>

      {/* Chart Container */}
      <div
        ref={chartContainerRef}
        className={`w-full transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}
        style={{ height }}
      />
    </div>
  );
};

export default CandlestickChart;