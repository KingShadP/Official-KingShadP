<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/8b97a5a5-0ef4-42a7-b554-e00f315ea5b8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. (Optional admin auth) add:
   - `ADMIN_USERNAME=<admin username>`
   - `ADMIN_PASSWORD=<admin password>`
   - `ADMIN_SESSION_SECRET=<long random secret>`
4. Run the app:
   `npm run dev`

For production build (server runtime): `npm run build`

For Shopify product integration, add:
- `SHOPIFY_STORE_DOMAIN=<your-store.myshopify.com>`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN=<storefront access token>`

## Admin auth module

- Login page: `/admin/login`
- Protected page: `/admin`
- API routes:
  - `POST /api/admin/login`
  - `GET /api/admin/session`
  - `POST /api/admin/refresh`
  - `POST /api/admin/logout`
