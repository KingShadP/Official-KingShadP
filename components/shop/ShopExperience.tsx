"use client";

import type { ShopifyProduct } from "@/lib/shopify";
import { TryOnStudio } from "@/components/shop/TryOnStudio";

export function ShopExperience({ products }: { products: ShopifyProduct[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="group block overflow-hidden border border-ivory/10 bg-panel"
        >
          <a
            href={product.onlineStoreUrl ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            <div className="aspect-[4/5] overflow-hidden bg-black/20">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.imageAlt ?? product.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>
          </a>
          <div className="p-5">
            <h2 className="font-serif text-2xl font-light text-ivory/90">{product.title}</h2>
            {product.price ? (
              <p className="mt-3 font-mono text-[10px] tracking-[0.3em] uppercase text-bronze">
                {product.price.currencyCode} {Number(product.price.amount).toFixed(2)}
              </p>
            ) : null}
            <TryOnStudio productTitle={product.title} productImageUrl={product.imageUrl} />
          </div>
        </div>
      ))}
    </div>
  );
}
