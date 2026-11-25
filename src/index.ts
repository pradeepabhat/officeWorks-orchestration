import express from 'express';
import { fetchAllProducts, getCategories, getFeaturedProducts, getProduct, searchProducts } from './controllers/ProductController';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/products/featured', getFeaturedProducts);
app.get('/products/search', searchProducts);
app.get('/products', getProduct);
app.get('/categories', getCategories);
app.get('/fetchAllProducts', fetchAllProducts);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
