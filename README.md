# OfficeWorks Orchestration

An Express 5 + TypeScript service that gets product data from the [Fake Store API](https://fakestoreapi.com).

## Prerequisites

- Node.js 20 or later (the code uses the built-in `fetch`)
- npm

## Getting started

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3000`. To use a different port, set `PORT`:

```bash
PORT=4000 npm run dev
```

## Scripts

| Script          | Description                                         |
| --------------- | --------------------------------------------------- |
| `npm run dev`   | Runs `src/index.ts` with `tsx` and restarts on changes |
| `npm run build` | Compiles TypeScript to `dist/`                      |
| `npm start`     | Runs the compiled server from `dist/index.js`       |

## API

### `GET /products/featured`

Returns 5 random products.

- `200`: `Product[]`
- `502`: the Fake Store API call failed

### `GET /products/search?q=<term>`

Returns products whose title contains `q` (case-insensitive).

- `200`: `Product[]`
- `400`: `q` is missing or empty
- `502`: the Fake Store API call failed

### `GET /products?id=<id>`

Returns one product by ID.

- `200`: `Product`
- `400`: `id` is not a non-negative integer
- `404`: product not found
- `502`: the Fake Store API call failed

### Product shape

```ts
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
```

All errors return the same shape:

```json
{ "error": "message" }
```

## Example requests

```bash
curl localhost:3000/health
curl localhost:3000/products/featured
curl "localhost:3000/products/search?q=shirt"
curl "localhost:3000/products?id=1"
```

## Project structure

```
src/
├── index.ts                  # Express app setup and routes
├── accessors/
│   ├── HttpAccessor.ts       # fetch wrapper
│   └── FakeStoreAccessor.ts  # Fake Store API calls
├── controllers/
│   └── ProductController.ts  # featured, search, and get-by-id handlers
└── responses/
    └── ProductResponse.ts    # Product type
```

## Limitations

- There are no automated tests yet.
- The search and featured endpoints fetch the full product list on every request; there is no caching.
