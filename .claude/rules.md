## TypeScript General Guidelines

### Basic Principles
**Do:** Always specify types for variables, parameters, and return values; create custom interfaces; document public APIs with JSDoc; use English exclusively; limit functions to under 20 lines; export only one item per file.
*Example:*
```typescript
function calculateTotal(items: ReadonlyArray<Item>): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```
**Don't:** Rely on `any`; insert blank lines inside functions; mix languages in code/comments.
*Example (Avoid):*
```typescript
let x: any; // No typing

function bad() {
  
  return something;
  
}
```

### Nomenclature
**Do:** Apply PascalCase to classes, camelCase to vars/functions, kebab-case to files, UPPERCASE to env vars; prefix booleans with verbs (isValid, hasItems); define constants over magic numbers; use full words.
*Example:*
```typescript
const MAX_RETRIES = 3;
const isUserActive = true;
```
**Don't:** Use abbreviations except standards (API, URL, i/j for loops, err/ctx/req/res); spell incorrectly.
*Example (Avoid):*
```typescript
const max_rt = 3; // Abbrev + wrong case
```

### Functions
**Do:** Keep functions short/single-purpose; start names with verbs (getUser, validateInput); use early returns; extract utils; prefer map/filter/reduce; arrow funcs for <3 lines; RO-RO objects for params/returns; default params.
*Example:*
```typescript
const getUser = ({ id }: { id: string }): User | null => users.find(u => u.id === id);
```
**Don't:** Nest deeply; pass many primitives; mix abstractions; check null manually.
*Example (Avoid):*
```typescript
function complex(params1, params2, ...) {
  if (!params1) return;
  // Deep nesting
}
```

### Data Handling
**Do:** Wrap primitives in types/classes; validate in classes; prefer immutability with `readonly`/`as const`.
*Example:*
```typescript
type UserId = string & { readonly brand: unique symbol };
const ids = ['a', 'b'] as const;
```
**Don't:** Validate in funcs; mutate data freely.

### Classes
**Do:** Adhere to SOLID; compose over inherit; small classes (<200 lines, <10 props/methods); define interfaces.
*Example:*
```typescript
interface UserService {
  find(id: string): Promise<User>;
}
class UserServiceImpl implements UserService { /* impl */ }
```
**Don't:** Bloat classes; inherit unnecessarily.

### Exceptions
**Do:** Throw for unexpected errors; catch only to fix/add context; use global handlers.
**Don't:** Catch without purpose.

### Testing
**Do:** Use AAA for units (inputX, expectedX); test public funcs with mocks; acceptance with GWT.
*Example:*
```typescript
test('calculates total', () => {
  const inputItems = [...];
  const actual = calculateTotal(inputItems);
  expect(actual).toBe(expectedTotal);
});
```
**Don't:** Skip tests; use unclear names.

## Fastify-Specific Rules

### Architecture
**Do:** Modularize by domain/routes; one plugin/handler per resource; use hooks for lifecycle; core folder for shared utils/middleware/errors/logging.
*Example:*
```typescript
// plugins/users/index.ts
fastify.register(usersRoutes, { prefix: '/users' });
```
**Don't:** Monolithic files; mix concerns.

### Validation & ORM
**Do:** JSON schemas + ajv; DTOs; Prisma Client in services; schema for types/migrations.
*Example:*
```typescript
const userSchema = { type: 'object', properties: { name: { type: 'string' } } };
fastify.post('/users', { schema: { body: userSchema } }, handler);
```
**Don't:** Manual validation; direct DB in handlers.

### Environment & Testing
**Do:** dotenv for env vars; Jest for units/integrations; mocks; E2E with inject(); /health routes.
*Example:*
```typescript
const response = app.inject({ method: 'GET', url: '/health' });
expect(response.statusCode).toBe(200);
```
**Don't:** Hardcode secrets; skip E2E.
