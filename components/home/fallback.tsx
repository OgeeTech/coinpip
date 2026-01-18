import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/lib/utils";

export const CoinOverviewFallback = () => {
    return (
        <div id="coin-overview-fallback">
            <div className="header">
                <Skeleton className="header-image" />
                <div className="info">
                    <Skeleton className="header-line-sm" />
                    <Skeleton className="header-line-lg" />
                </div>
            </div>
            <div className="chart">
                <Skeleton className="chart-skeleton" />
            </div>
        </div>
    );
};

export const TrendingCoinFallback = () => {
    return (
        <div id="trending-coins-fallback">
            <h4>Trending Coins</h4>
            <div className="trending-coins-table">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>24h Change</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell className="name-cell">
                                    <div className="name-link">
                                        <Skeleton className="name-image" />
                                        <Skeleton className="name-line" />
                                    </div>
                                </TableCell>
                                <TableCell className="price-cell">
                                    <Skeleton className="price-line" />
                                </TableCell>
                                <TableCell className="change-cell">
                                    <div className="price-change">
                                        <Skeleton className="change-icon" />
                                        <Skeleton className="change-line" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
