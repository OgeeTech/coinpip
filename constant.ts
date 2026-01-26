import {
    CandlestickSeriesPartialOptions,
    ChartOptions,
    ColorType,
    DeepPartial,
} from 'lightweight-charts';

export const navItems = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: 'Search',
        href: '/',
    },
    {
        label: 'All Coins',
        href: '/coins',
    },
];

const CHART_COLORS = {
    background: '#0b1116',
    text: '#8f9fb1',
    grid: '#1a2332',
    border: '#1a2332',
    crosshairVertical: '#ffffff40',
    crosshairHorizontal: '#ffffff20',
    candleUp: '#158A6E',
    candleDown: '#EB1C36',
} as const;

export const getCandlestickConfig = (): CandlestickSeriesPartialOptions => ({
    upColor: CHART_COLORS.candleUp,
    downColor: CHART_COLORS.candleDown,
    wickUpColor: CHART_COLORS.candleUp,
    wickDownColor: CHART_COLORS.candleDown,
    borderVisible: true,
    wickVisible: true,
});

export const getChartConfig = (
    height: number,
    timeVisible: boolean = true,
): DeepPartial<ChartOptions> => ({
    width: 0,
    height,
    layout: {
        background: { type: ColorType.Solid, color: CHART_COLORS.background },
        textColor: CHART_COLORS.text,
        fontSize: 12,
        fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial',
    },
    grid: {
        vertLines: { visible: false },
        horzLines: {
            visible: true,
            color: CHART_COLORS.grid,
            style: 2,
        },
    },
    rightPriceScale: {
        borderColor: CHART_COLORS.border,
    },
    timeScale: {
        borderColor: CHART_COLORS.border,
        timeVisible,
        secondsVisible: false,
    },
    handleScroll: true,
    handleScale: true,
    crosshair: {
        mode: 1,
        vertLine: {
            visible: true,
            color: CHART_COLORS.crosshairVertical,
            width: 1,
            style: 0,
        },
        horzLine: {
            visible: true,
            color: CHART_COLORS.crosshairHorizontal,
            width: 1,
            style: 0,
        },
    },
    localization: {
        priceFormatter: (price: number) =>
            '$' + price.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    },
});

// Update this in your constants file
// @/constant/index.ts

export type Period = 'hourly' | 'daily' | 'weekly'; // Add whatever strings you use

export const PERIOD_CONFIG = {
    hourly: { days: 1 },
    daily: { days: 7 },
    weekly: { days: 30 },
};

export const PERIOD_BUTTONS = [
    { label: '1D', value: 'hourly' },
    { label: '7D', value: 'daily' },
    { label: '1M', value: 'weekly' },
];
export const LIVE_INTERVAL_BUTTONS: { value: '1s' | '1m'; label: string }[] = [
    { value: '1s', label: '1s' },
    { value: '1m', label: '1m' },
];