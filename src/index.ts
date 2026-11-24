import express, { Request, Response } from 'express';
import { createUser } from './controllers/UserController';
import { getFeaturedProducts, getProduct, searchProducts } from './controllers/ProductController';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/users', createUser);

app.get('/products/featured', getFeaturedProducts);
app.get('/products/search', searchProducts);
app.get('/products', getProduct);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
