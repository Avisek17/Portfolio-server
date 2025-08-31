#!/usr/bin/env node
/**
 * Simple smoke test:
 *  - Health check (expect 200)
 *  - Public projects list (expect 200 + array)
 *  - Unauthorized profile access (expect 401)
 */
import https from 'https';
import http from 'http';

const BASE_URL = process.env.SMOKE_BASE_URL || process.env.BASE_URL || 'http://localhost:5001';

function request(path, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request(url, { method: opts.method || 'GET', headers: opts.headers || {} }, res => {
      let data = '';
      res.on('data', d => (data += d));
      res.on('end', () => {
        let json;
        try { json = JSON.parse(data); } catch { json = data; }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });
    req.on('error', reject);
    if (opts.body) req.write(typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body));
    req.end();
  });
}

(async () => {
  const results = [];
  try {
    const health = await request('/api/health');
    results.push(['health', health.status === 200 ? 'PASS' : 'FAIL', health.status]);

    const projects = await request('/api/portfolio/projects');
    const projOk = projects.status === 200 && Array.isArray(projects.body);
    results.push(['projects', projOk ? 'PASS' : 'FAIL', projects.status]);

    const unauthorized = await request('/api/auth/profile');
    results.push(['unauth_profile_401', unauthorized.status === 401 ? 'PASS' : 'FAIL', unauthorized.status]);

    const failCount = results.filter(r => r[1] === 'FAIL').length;
    console.table(results.map(r => ({ check: r[0], result: r[1], status: r[2] })));
    if (failCount) {
      console.error(`Smoke FAILED (${failCount} failing checks)`);
      process.exit(1);
    }
    console.log('All smoke checks PASS');
  } catch (e) {
    console.error('Smoke test error:', e.message);
    process.exit(1);
  }
})();
