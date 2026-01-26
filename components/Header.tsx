'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Search, Loader2, X, Menu } from 'lucide-react'; // Added Menu for mobile potential
import { fetcher } from '@/lib/coingecko.actions';

const Header = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const data = await fetcher<any>(`search?query=${query}`);
                setResults(data?.coins?.slice(0, 8) || []);
                setIsOpen(true);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelectCoin = (coinId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('coin', coinId);
        router.push(`/?${params.toString()}`);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-dark-300 bg-dark-400">
            {/* Reduced height on mobile (h-16) vs desktop (h-20) */}
            <div className='main-container flex items-center h-16 md:h-20 gap-4 md:gap-8'>

                {/* Logo Section - Scaled down for mobile */}
                <Link href="/" className={cn('flex-shrink-0', { 'is-active': pathname === '/' })}>
                    <Image
                        src="/logo.png"
                        alt='coinpip Logo'
                        width={100}
                        height={30}
                        className="object-contain md:w-[120px] md:h-[36px]"
                    />
                </Link>

                <div className="flex flex-1 items-center justify-end md:justify-between gap-2 md:gap-6">
                    {/* Navigation - Hidden on mobile/tablet, shown on LG up */}
                    <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <Link href="/" className={cn("transition-colors", pathname === '/' ? "text-green-500 font-bold" : "hover:text-white")}>
                            Home
                        </Link>
                        <Link href="/coins" className={cn("transition-colors", pathname === '/coins' ? "text-green-500 font-bold" : "hover:text-white")}>
                            All Coins
                        </Link>
                    </nav>

                    {/* Search Bar - Responsive width */}
                    <div className="relative w-full max-w-[180px] sm:max-w-xs md:max-w-md" ref={searchRef}>
                        <div className="flex items-center bg-dark-200 border border-dark-300 rounded-full px-3 md:px-4 py-1.5 md:py-2 group focus-within:ring-2 focus-within:ring-green-500/50 transition-all">
                            <Search className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 group-focus-within:text-green-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => query.length > 1 && setIsOpen(true)}
                                className="w-full bg-transparent border-none text-xs md:text-sm text-white px-2 md:px-3 focus:outline-none placeholder:text-gray-500"
                            />
                            {isSearching ? (
                                <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500 animate-spin" />
                            ) : query && (
                                <button onClick={() => setQuery('')} className="text-gray-500 hover:text-white">
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown - Full width on mobile */}
                        {isOpen && results.length > 0 && (
                            <div className="absolute top-full left-[-50px] sm:left-0 right-0 mt-2 bg-dark-300 border border-dark-200 rounded-xl shadow-2xl overflow-hidden z-[100] min-w-[240px]">
                                <ul className="max-h-60 md:max-h-80 overflow-y-auto custom-scrollbar">
                                    {results.map((coin) => (
                                        <li key={coin.id}>
                                            <button
                                                onClick={() => handleSelectCoin(coin.id)}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-200 text-left border-b border-white/5 last:border-0"
                                            >
                                                <Image src={coin.thumb} alt={coin.name} width={20} height={20} className="rounded-full md:w-6 md:h-6" />
                                                <div className="overflow-hidden">
                                                    <p className="text-xs md:text-sm font-medium text-white truncate">{coin.name}</p>
                                                    <p className="text-[9px] md:text-[10px] text-gray-500 uppercase">{coin.symbol}</p>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header