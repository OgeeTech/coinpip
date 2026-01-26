import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* =======================
    Types
======================= */

export type DataTableColumn<T> = {
    header: string;
    cell: (item: T, index: number) => React.ReactNode;
    cellClassName?: string;
    headerClassName?: string; // Corrected from headClassName to match usage
};

export type DatatableProps<T> = {
    columns?: DataTableColumn<T>[];
    data?: T[];
    rowKey?: (row: T, index: number) => React.Key;
    tableClassName?: string;
    headerRowClassName?: string;
    headerCellClassName?: string;
    bodyRowClassName?: string;
    bodyCellClassName?: string;
};

/* =======================
    Component
======================= */

const Datatable = <T,>({
    columns = [],
    data = [],
    rowKey = (_row, index) => index,
    tableClassName,
    headerRowClassName,
    headerCellClassName,
    bodyRowClassName,
    bodyCellClassName,
}: DatatableProps<T>) => {
    return (
        <Table className={cn("custom-scrollbars", tableClassName)}>
            {/* ---------- Header ---------- */}
            <TableHeader>
                <TableRow className={cn("hover:bg-transparent", headerRowClassName)}>
                    {columns.length > 0 ? (
                        columns.map((column, index) => (
                            <TableHead
                                key={index}
                                className={cn(
                                    "bg-dark-400 text-purple-100 py-4 first:pl-5 last:pr-6",
                                    headerCellClassName,
                                    column.headerClassName // Updated to match type definition
                                )}
                            >
                                {column.header}
                            </TableHead>
                        ))
                    ) : (
                        <TableHead className="text-center py-4">
                            No columns defined
                        </TableHead>
                    )}
                </TableRow>
            </TableHeader>

            {/* ---------- Body ---------- */}
            <TableBody>
                {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <TableRow
                            key={rowKey(row, rowIndex)}
                            className={cn(
                                "overflow-hidden border-b border-purple-100/5 hover:bg-dark-400/30",
                                bodyRowClassName
                            )}
                        >
                            {columns.map((column, columnIndex) => (
                                <TableCell
                                    key={columnIndex}
                                    className={cn(
                                        "py-4 first:pl-5 last:pr-5",
                                        bodyCellClassName,
                                        column.cellClassName // Added this so your custom column styles work
                                    )}
                                >
                                    {column.cell(row, rowIndex)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length || 1}
                            className="py-6 text-center text-sm text-muted-foreground"
                        >
                            No data available
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default Datatable;