import React from 'react';
import Image from 'next/image'; // 1. Added missing Image import
import { fetcher } from '@/lib/coingecko.actions';
import Datatable, { DataTableColumn } from '../Datatable';

// 2. Updated Type to include top_3_coins
type Category = {
    id: string;
    name: string;
    top_3_coins: string[];
};

const Categories = async () => {
    const categories = await fetcher<Category[]>('coins/categories');

    const columns: DataTableColumn<Category>[] = [
        {
            header: 'Category',
            cellClassName: 'category-cell',
            cell: (category) => category.name,
        },
        {
            header: 'Top Gainers',
            cellClassName: 'Top-gainers-cell',
            cell: (category) => (
                <div className="flex gap-2">
                    {/* 3. Added specific rendering container and safety check */}
                    {category.top_3_coins?.map((coin) => (
                        <Image
                            src={coin}
                            alt={`${category.name} top coin`} // 4. Better alt text
                            key={coin}
                            width={28}
                            height={28}
                            className="rounded-full" // Optional: visual polish
                        />
                    ))}
                </div>
            ),
        }
    ];

    return (
        <div id="categories" className="custom-scrollbar">
            <h4>Top Categories</h4>

            <Datatable
                columns={columns}
                // 5. Ensure data exists before slicing
                data={categories ? categories.slice(0, 10) : []}
                // 6. Use unique ID instead of index for better React performance
                rowKey={(row) => row.id}
                tableClassName="mt-3"
            />
        </div>
    );
};

export default Categories;