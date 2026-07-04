type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  imageUrl: string | null;
  imageAlt: string | null;
  price: Money | null;
  onlineStoreUrl: string | null;
};

const PRODUCTS_QUERY = `
  query Products {
    products(first: 12) {
      edges {
        node {
          id
          title
          handle
          onlineStoreUrl
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return [];
  }

  const response = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query: PRODUCTS_QUERY }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as {
    data?: {
      products?: {
        edges?: Array<{
          node: {
            id: string;
            title: string;
            handle: string;
            onlineStoreUrl: string | null;
            featuredImage: { url: string; altText: string | null } | null;
            priceRange: { minVariantPrice: Money | null } | null;
          };
        }>;
      };
    };
    errors?: Array<{ message: string }>;
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(" "));
  }

  return (
    payload.data?.products?.edges?.map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      imageUrl: node.featuredImage?.url ?? null,
      imageAlt: node.featuredImage?.altText ?? null,
      price: node.priceRange?.minVariantPrice ?? null,
      onlineStoreUrl: node.onlineStoreUrl,
    })) ?? []
  );
}
