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

export type OHLCData = [
  number, // timestamp (ms)
  number, // open
  number, // high
  number, // low
  number  // close
];

type Props = {
  coinId: string;
  data?: OHLCData[];
  height?: number;
  initialPeriod?: Period;
  children?: ReactNode;
};

const CandlestickChart = ({
  children,
  data = [],
  coinId,
  height = 360,
  initialPeriod = 'weekly',
}: Props) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const fetchOHLCData = async (selectedPeriod: Period) => {
    const config = PERIOD_CONFIG[selectedPeriod];
    if (!config) return [];

    setIsLoading(true);

    try {
      // Logic: CoinGecko /ohlc does NOT support the 'interval' parameter.
      // It auto-calculates granularity based on 'days'.
      const response = await fetcher<OHLCData[]>(
        `coins/${coinId}/ohlc`,
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

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;

    startTransition(async () => {
      const newData = await fetchOHLCData(newPeriod);
      setPeriod(newPeriod);
      setOhlcData(newData);
    });
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current?.remove();

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#c7c7c7',
      },
      grid: {
        vertLines: { color: '#1f2933' },
        horzLines: { color: '#1f2933' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [height]); // Removed 'period' to prevent full chart re-mount on period change

  useEffect(() => {
    if (!candleSeriesRef.current) return;

    const formattedData = ohlcData.map(
      ([time, open, high, low, close]) => ({
        time: Math.floor(time / 1000) as UTCTimestamp,
        open,
        high,
        low,
        close,
      })
    );

    candleSeriesRef.current.setData(formattedData);
    chartRef.current?.timeScale().fitContent();
  }, [ohlcData]);

  return (
    <div className="rounded-lg border border-dark-300 p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">{children}</div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline text-sm font-medium text-purple-100/50">
            Period:
          </span>

          {PERIOD_BUTTONS.map(({ value, label }) => {
            const isActive = period === value;

            return (
              <button
                key={value}
                onClick={() => handlePeriodChange(value)}
                disabled={isPending || isLoading}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition
                  ${isActive
                    ? 'bg-green-500 text-white'
                    : 'bg-dark-200 text-gray-300 hover:bg-dark-300'
                  }
                  ${isPending || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={chartContainerRef}
        className={`w-full ${isLoading ? 'opacity-50 animate-pulse' : ''}`}
        style={{ height }}
      />
    </div>
  );
};

export default CandlestickChart;