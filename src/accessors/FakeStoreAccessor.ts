import { HttpAccessor } from './HttpAccessor';
import { ProductResponse } from '../responses/ProductResponse';

const http = new HttpAccessor('https://fakestoreapi.com');

export const getProducts = (): Promise<ProductResponse[]> => http.get<ProductResponse[]>('/products');

export const getProductById = (id: number): Promise<ProductResponse | null> =>
  http.getOrNull<ProductResponse>(`/products/${id}`);
