# SOLUTION.md

## Backend

### Refactor blocking I/O
- Replaced all `fs.readFileSync` usage with `fs.promises.readFile` to ensure non-blocking I/O operations.
- Affected file: `routes/items.js`.

### Performance: Cached Stats
- Cached the `/api/stats` response in memory to avoid recalculating on every request.
- Implemented `fs.watchFile` to automatically update the cached stats when `items.json` changes.
- Affected file: `routes/stats.js`.

### Testing (Jest)
- Added unit tests for `routes/items.js` covering:
  - Happy paths: fetching items, creating items.
  - Error cases: non-existent item ID, missing fields, invalid input.
- Test directory: `backend/tests/`
- Run tests:
  ```bash
  cd backend
  npm test
  ```

## Frontend

### Memory Leak
- Used `AbortController` in `Items/index.js` to cancel fetch requests when the component unmounts.

### Pagination and Search
- Implemented server-side pagination and search using `?q=`, `?page=`, and `?limit=` parameters.
- The UI reflects the current page and search query.
- Search input is debounced using `lodash.debounce`.

### Performance Optimization
- Integrated `react-window` (`FixedSizeList`) for list virtualization to improve performance with large datasets.
- File: `pages/Items/index.js`.

### UI/UX Enhancements
- Styled pagination controls and active states.
- Search bar includes a search icon and placeholder behavior.
- List items include a right arrow icon.
- Skeleton loading placeholder added while data is being fetched.

## How to Run the Project

### Prerequisites
- Node.js and npm installed

### Start the Backend

```bash
cd backend
npm install
npm start
```

Backend runs at `http://localhost:3001`.

### Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (or the port shown in terminal).

### Run Backend Tests

```bash
cd backend
npm test
```
