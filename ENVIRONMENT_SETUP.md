# Prayer Partners Frontend - Environment Setup

## Overview

The frontend uses Angular's built-in environment configuration system rather than `.env` files. Configuration is managed through TypeScript environment files.

## Environment Files

### 1. Development Environment
**File:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: '', // Empty string uses proxy configuration
  allowedOrigins: [
    'http://localhost:4200',
    'http://localhost:8080'
  ]
};
```

**Usage:**
- Used when running `npm start` or `ng serve`
- API calls are proxied through `proxy.conf.json`
- Backend must be running on `http://127.0.0.1:8080`

### 2. Production Environment
**File:** `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://prayer-partner-backend.onrender.com',
  allowedOrigins: [
    'https://prayer-partner-frontend.vercel.app',
    'https://your-custom-domain.com'
  ],
  apiTimeout: 30000,
  retryAttempts: 3
};
```

**Usage:**
- Used when running `npm run build:prod`
- API calls go directly to the backend URL specified in `apiUrl`
- Update `apiUrl` to point to your production backend

## Proxy Configuration (Development)

**File:** `proxy.conf.json`

This file routes API requests from the Angular dev server to the backend:

```json
{
  "/auth": {
    "target": "http://127.0.0.1:8080",
    "secure": false,
    "changeOrigin": true
  },
  "/users": { ... },
  "/pairings": { ... },
  "/themes": { ... },
  "/prayer-requests": { ... }
}
```

## Setup Instructions

### Development Setup

1. **No .env file needed** - Configuration is already in `environment.ts`

2. **Ensure Backend is Running:**
   ```bash
   # Backend must be running on port 8080
   cd Prayer-Partner-BAckend
   npm run dev
   ```

3. **Start Frontend:**
   ```bash
   cd Prayer-Partner-Frontend
   npm start
   ```

4. **Access Application:**
   - Frontend: http://localhost:4200
   - Backend: http://localhost:8080

### Production Deployment

1. **Update Production Environment:**

   Edit `src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-backend-url.com', // Update this!
     allowedOrigins: [
       'https://your-frontend-url.com' // Update this!
     ],
     apiTimeout: 30000,
     retryAttempts: 3
   };
   ```

2. **Build for Production:**
   ```bash
   npm run build:prod
   ```

3. **Deploy:**
   - Deploy `dist/prayer-partners-app` folder to your hosting provider
   - Ensure backend CORS allows your frontend domain

## Modifying Configuration

### Adding New Environment Variables

1. Add to both environment files:
   ```typescript
   // environment.ts
   export const environment = {
     production: false,
     apiUrl: '',
     newVariable: 'dev-value'
   };

   // environment.prod.ts
   export const environment = {
     production: true,
     apiUrl: 'https://...',
     newVariable: 'prod-value'
   };
   ```

2. Use in your components/services:
   ```typescript
   import { environment } from '../environments/environment';

   const value = environment.newVariable;
   ```

### Adding New API Proxy Routes

Edit `proxy.conf.json`:
```json
{
  "/new-route": {
    "target": "http://127.0.0.1:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

## Common Issues

### Issue: API calls fail in development
**Solution:** Ensure backend is running on port 8080 and proxy.conf.json is properly configured

### Issue: CORS errors in production
**Solution:** Update `FRONTEND_PRODUCTION_URLS` in backend `.env` file to include your frontend domain

### Issue: Wrong backend URL in production
**Solution:** Update `apiUrl` in `environment.prod.ts` before building

## Notes

- Angular automatically uses the correct environment file based on the build configuration
- Never commit sensitive data to environment files
- For production secrets, use your hosting provider's environment variable system
- The proxy configuration only works in development with `ng serve`
