# Design Decisions & Assumptions

## Assumptions

### 1. **FakeStoreAPI Stability**
- **Assumption**: The Fake Store API (`https://fakestoreapi.com`) is reliable and available.
- **Why**: The service depends on it for all product data. No fallback cache or offline mode is implemented yet.
- **Mitigation**: Error responses (502) indicate upstream failures; clients can retry.

### 2. **In-Memory Data Fetching**
- **Assumption**: It's acceptable to fetch the full product list on every request for search, featured, and categories endpoints.
- **Why**: The Fake Store API has ~20 products; in-memory fetching is simpler than caching.
- **Limitation**: This won't scale to larger datasets or high-traffic scenarios.

### 3. **No Authentication/Authorization**
- **Assumption**: All endpoints are public with no access control.
- **Why**: The PoC focuses on data orchestration; auth is out of scope.
- **Future**: Add auth middleware when user accounts or sensitive data are introduced.

### 4. **HTTP Client as Utility**
- **Assumption**: A simple `HttpAccessor` wrapper around `fetch` is sufficient.
- **Why**: Node.js 20+ has native `fetch`; no external HTTP library needed for basic use.
- **Tradeoff**: No retry logic, circuit breaker, or request timeouts configured.

---

## Requirements Dropped/Simplified

### 1. **User Endpoint (POST /users)**
- **Dropped**: Initial skeleton included a user-creation endpoint that wasn't part of core requirements.
- **Why**: The focus is on product orchestration. User management adds complexity without clear business value at this stage.
- **Impact**: Simplified the codebase by removing `UserController.ts` and user-related logic.

### 2. **Search Filtering on Client Side**
- **Simplified**: Search is case-insensitive title matching only.
- **Why**: Acceptable for a PoC; more sophisticated full-text search can be added later.
- **Alternative**: Could add filtering by price range, category, or other fields later.

### 3. **Response Pagination**
- **Not Implemented**: `/fetchAllProducts` returns all products in a single response.
- **Why**: FakeStoreAPI dataset is small (~20 products); pagination is premature optimization.
- **Future**: Add limit/offset query params when data grows.

---

## Design Decisions

### 1. **Layered Architecture**
```
index.ts (routes)
  ↓
controllers/ (handlers)
  ↓
accessors/ (API calls)
  ↓
responses/ (types)
```
- **Why**: Separation of concerns makes testing and maintenance easier. Easy to swap data sources.

### 2. **TypeScript Strict Mode**
- **Decision**: All TS files use `strict: true` in `tsconfig.json`.
- **Why**: Catches type errors early; better IDE support and self-documenting code.

### 3. **FakeStoreAPI as Single Source of Truth**
- **Decision**: No local database or cache layer; all requests hit the API.
- **Why**: Simplifies the PoC. Database would add infrastructure complexity.
- **Tradeoff**: Higher latency and dependency on external API.

### 4. **Generic `HttpAccessor` Class**
- **Decision**: Reusable HTTP utility instead of inline fetch calls.
- **Why**: Easier to swap API endpoints or add middleware later (logging, retries, auth headers).
- **Example**: Could point to a different API by changing the base URL in `FakeStoreAccessor`.

### 5. **Removal of User Management**
- **Decision**: Deleted `UserController.ts` and kept only product endpoints.
- **Why**: Clearer scope; user management is orthogonal to product orchestration.
- **Future**: Can be re-added as a separate domain if needed.

---

## Scalability & Growth Beyond PoC

### 1. **Multi-Source Data**
- **Current**: Reads from FakeStoreAPI only.
- **Future**: `accessors/` can grow to include multiple data sources (e.g., internal inventory, third-party vendors).
- **Example**:
  ```
  accessors/
    ├── FakeStoreAccessor.ts
    ├── InternalInventoryAccessor.ts
    ├── VendorAPIAccessor.ts
  ```

### 2. **Caching Layer**
- **Current**: None.
- **Future**: Add Redis or in-memory cache with TTL.
  ```typescript
  const categories = await cache.get('categories', 
    () => getCategories(), 
    { ttl: 3600 } // 1 hour
  );
  ```

### 3. **Database Integration**
- **Current**: Stateless; no persistence.
- **Future**: Add a database to store:
  - User preferences (favorites, search history)
  - Product metadata (ratings, inventory counts)
  - Audit logs
- **Design**: Keep accessors as adapters; database queries can live in a new `services/` layer.

### 4. **Authentication & Authorization**
- **Current**: None.
- **Future**: Add JWT or OAuth middleware.
  ```typescript
  app.use(authenticate); // Check JWT
  app.use(authorize);    // Check permissions
  ```

### 5. **Error Handling & Logging**
- **Current**: Basic console.error logs.
- **Future**: Structured logging (Winston, Pino) and centralized error reporting (Sentry).

### 6. **API Versioning**
- **Current**: Single version (`/v1/` implicit).
- **Future**: Support multiple API versions as requirements evolve.
  ```
  /v1/categories
  /v2/categories  (with new fields, pagination)
  ```

### 7. **Monitoring & Metrics**
- **Current**: None.
- **Future**: Add Prometheus metrics for request latency, error rates, cache hit rates.

---

## Next Steps (With One More Day)

### **Priority 1: Reliability**
1. **Add request timeouts** in `HttpAccessor` (e.g., 5-second timeout).
2. **Implement retry logic** with exponential backoff for transient failures.
3. **Add health check endpoint** (`GET /health`) to verify FakeStoreAPI connectivity.

### **Priority 2: Performance**
1. **Add in-memory caching** with a 1-hour TTL for products and categories.
2. **Implement request deduplication** (dedupe concurrent requests for the same resource).
3. **Add response compression** (gzip) for endpoints returning large arrays.

### **Priority 3: Testing**
1. **Write unit tests** for controllers and accessors.
2. **Add integration tests** for the full request/response flow.
3. **Mock the FakeStoreAPI** in tests to avoid external dependencies.

### **Priority 4: Documentation**
1. **Add OpenAPI/Swagger spec** for API documentation and auto-generated clients.
2. **Create CONTRIBUTING.md** with development guidelines.
3. **Add examples** for common use cases (filtering, sorting, pagination).

### **Priority 5: DevOps**
1. **Docker setup** (Dockerfile, docker-compose.yml) for easy local development.
2. **GitHub Actions CI/CD** to run tests, lint, and deploy on push.
3. **Environment configuration** (.env.example, .env.production).

---

## Trade-offs & Rationale

| Decision | Pro | Con | Revisit When |
|----------|-----|-----|--------------|
| No caching | Simple; always fresh data | High latency; API rate limit risk | Traffic spikes or large datasets |
| No database | Faster to develop | No data persistence | Need user preferences or analytics |
| No auth | Open API; easy testing | No security or user isolation | Multi-tenant users or sensitive data |
| Stateless design | Easy to scale horizontally | Can't store user sessions | User accounts needed |
| FakeStoreAPI only | Known, stable data | Single point of failure | Need real product inventory |

