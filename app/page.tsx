import Image from "next/image";
import Link from "next/link";
import Datatable from "@/components/Datatable";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetcher } from "@/lib/coingecko.actions";



const Page = async () => {


  return (
    <main className="main-container">
      <section className="home-grid">



      </section>
      <section className='w-full mt-7 space-y-4'>
        <p>Categories</p>
      </section>
    </main>
  );
};

export default Page;
