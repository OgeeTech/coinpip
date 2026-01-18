'use client';

import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';

import { createChart, CandlestickSeries, IChartApi } from 'lightweight-charts';
import { PERIOD_BUTTONS } from '@/constant';
import { fetcher } from '@/lib/coingecko.actions';
import { convertOHLCData } from '@/lib/utils';

/* =======================
   Types
======================= */

export type OHLCData = [
  number, // timestamp
  number, // open
  number, // high
  number, // low
  number  // close
];

export type Period = 'hourly' | 'daily';

type Props = {
  coinId: string;
  data: OHLCData[];
  height?: number;
  initialPeriod?: Period;
  children?: ReactNode;
};

/* =======================
   Period Config
======================= */

const PERIOD_CONFIG: Record<Period, { days: number; interval?: string }> = {
  hourly: { days: 1 },
  daily: { days: 7 },
};

/* ======================= 
   Component
======================= */

const CandlestickChart = ({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = 'daily',
}: Props) => {
  const chartContainer = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
  const [isPending, startTransition] = useTransition();

  /* =======================
     Fetch OHLC Data
  ======================= */

  const fetchOHLCData = async (selectedPeriod: Period) => {
    const config = PERIOD_CONFIG[selectedPeriod];

    const newData = await fetcher<OHLCData[]>(
      `coins/${coinId}/ohlc`,
      {
        vs_currency: 'usd',
        days: config.days,
        interval: config.interval,
        precision: 'full',
      }
    );

    return newData ?? [];
  };

  /* =======================
     Handle Period Change
  ======================= */

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;

    startTransition(async () => {
      const newData = await fetchOHLCData(newPeriod);
      setPeriod(newPeriod);
      setOhlcData(newData);
    });
  };

  /* =======================
     Chart Setup
  ======================= */

  useEffect(() => {
    if (!chartContainer.current) return;

    // Cleanup old chart
    chartRef.current?.remove();

    const chart = createChart(chartContainer.current, {
      width: chartContainer.current.clientWidth,
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
        timeVisible: period === 'hourly',
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

    series.setData(
      ohlcData.map(([time, open, high, low, close]) => ({
        time: Math.floor(time / 1000),
        open,
        high,
        low,
        close,
      }))
    );

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(chartContainer.current);

    return () => {

      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      CandleSeriesRef.current = null;
    };
  }, [height]);

  useEffect(() => {
    if (!cadleSeriesRef.current) return;

    const convertedToSeconds = ohlcData.map((time) => ({
      [Math.floor(time[0] / 1000)], item[1], item[2], item[3], item[4] as OHLCData,])
    
    const converted = convertOHLCData(convertedToSeconds);
    candleSeriesRef.current.setData(converted);
    chartRef.current?.timeScale().fitContent();
  }, [ohlcData, period]);

  return (
    <div
      id={`candlestick-chart-${coinId}`}
      className="rounded-lg border border-dark-300 p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">{children}</div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-purple-100/50">
            Period:
          </span>

          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handlePeriodChange(value as Period)}
              disabled={isPending}
              className={
                period === value
                  ? 'config-button-active'
                  : 'config-button'
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div
        ref={chartContainer}
        className="w-full"
        style={{ height }}
      />
    </div>
  );
};

export default CandlestickChart;
