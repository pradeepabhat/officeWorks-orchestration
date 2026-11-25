import { Request, Response } from 'express';
import { getProductById, getProducts } from '../accessors/FakeStoreAccessor';
import { ProductResponse } from '../responses/ProductResponse';
import { ErrorResponse } from '../responses/UserResponse';

const FEATURED_COUNT = 5;

const pickRandom = <T>(items: T[], count: number): T[] => {
  const copy = [...items];
  // Partial Fisher-Yates shuffle: only the first `count` slots need randomizing
  for (let i = 0; i < Math.min(count, copy.length); i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
};

export const getFeaturedProducts = async (
  _req: Request,
  res: Response<ProductResponse[] | ErrorResponse>,
) => {
  try {
    const products = await getProducts();
    res.status(200).json(pickRandom(products, FEATURED_COUNT));
  } catch (err) {
    console.error('Failed to fetch products', err);
    res.status(502).json({ error: 'Failed to fetch products' });
  }
};

export const searchProducts = async (
  req: Request,
  res: Response<ProductResponse[] | ErrorResponse>,
) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
  if (!query) {
    res.status(400).json({ error: 'Query parameter "q" is required' });
    return;
  }
  try {
    const products = await getProducts();
    res.status(200).json(products.filter((p) => p.title.toLowerCase().includes(query)));
  } catch (err) {
    console.error('Failed to fetch products', err);
    res.status(502).json({ error: 'Failed to fetch products' });
  }
};

export const fetchAllProducts = async (
  _req: Request,
  res: Response<ProductResponse[] | ErrorResponse>,
) => {
  try {
    res.status(200).json(await getProducts());
  } catch (err) {
    console.error('Failed to fetch products', err);
    res.status(502).json({ error: 'Failed to fetch products' });
  }
};

export const getCategories = async (
  _req: Request,
  res: Response<string[] | ErrorResponse>,
) => {
  try {
    const products = await getProducts();
    res.status(200).json([...new Set(products.map((p) => p.category))]);
  } catch (err) {
    console.error('Failed to fetch categories', err);
    res.status(502).json({ error: 'Failed to fetch categories' });
  }
};

export const getProduct = async (
  req: Request,
  res: Response<ProductResponse | ErrorResponse>,
) => {
  const rawId = typeof req.query.id === 'string' ? req.query.id.trim() : '';
  const id = Number(rawId);
  if (!/^\d+$/.test(rawId) || !Number.isSafeInteger(id)) {
    res.status(400).json({ error: 'Query parameter "id" must be a non-negative integer' });
    return;
  }
  try {
    const product = await getProductById(id);
    if (!product) {
      res.status(404).json({ error: `Product ${id} not found` });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(`Failed to fetch product ${id}`, err);
    res.status(502).json({ error: 'Failed to fetch product' });
  }
};
