import Image from "next/image";
import Link from "next/link";
import type { Store } from "@/lib/data";

export function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      href={`/magaza/${store.slug}`}
      className="group bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    >
      <div className="relative aspect-[4/3] bg-stone-50 overflow-hidden">
        <Image
          src={store.image}
          alt={store.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-base text-stone-900 group-hover:text-orange-600">
          {store.name}
        </h3>
        <div className="mt-1 flex items-center justify-between text-xs text-stone-500">
          <span className="font-medium">{store.category}</span>
          <span className="font-semibold text-stone-700">{store.floor}</span>
        </div>
      </div>
    </Link>
  );
}
