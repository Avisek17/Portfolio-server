## Deployment Notes

### Environment Variables
Set `FRONTEND_URLS` to a comma-separated list of allowed origins (e.g. `https://yourdomain.com,https://www.yourdomain.com`). This drives dynamic CORS logic in `server.js`.

```
PORT=5001
NODE_ENV=production
MONGODB_URI=...
JWT_SECRET=...
FRONTEND_URLS=https://yourdomain.com,https://www.yourdomain.com
```

### Validation
- Auth login: username (min 3), password (min 6)
- Profile: optional email must be valid
- Change password: currentPassword required; newPassword min 6 + mixed case + number
- Contact: name required (<=80), email valid, subject <=140 (optional), message required (<=2000)
- Uploads: images limited to standard image mimetypes; resumes allow pdf/jpg/png/gif; certificates allow pdf/png/jpg/webp.

### Security Middleware
- Helmet with cross-origin resource policy adjusted
- Rate limiting (configurable via RATE_LIMIT_MAX)
- Compression + morgan logging
- Graceful shutdown handlers

### Next Steps
- Add per-route limiter for `/api/auth/login`
- Add unit tests for validation failures
- Implement content security policy when front-end external asset list finalized
