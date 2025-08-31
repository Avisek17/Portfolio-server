#!/usr/bin/env node
/**
 * Minimal burst load test for one endpoint.
 * Usage: node scripts/loadTest.js [endpoint] [requests]
 */
import https from 'https';
import http from 'http';

const BASE_URL = process.env.LOAD_BASE_URL || process.env.BASE_URL || 'http://localhost:5001';
const endpoint = process.argv[2] || '/api/portfolio/projects';
const total = parseInt(process.argv[3] || '50', 10);

function single(idx) {
  return new Promise((resolve) => {
    const url = new URL(endpoint, BASE_URL);
    const lib = url.protocol === 'https:' ? https : http;
    const start = Date.now();
    const req = lib.get(url, res => {
      res.resume();
      res.on('end', () => resolve({ idx, status: res.statusCode, ms: Date.now() - start }));
    });
    req.on('error', () => resolve({ idx, status: 0, ms: Date.now() - start }));
  });
}

(async () => {
  const startAll = Date.now();
  const promises = [];
  for (let i = 0; i < total; i++) promises.push(single(i));
  const results = await Promise.all(promises);
  const success = results.filter(r => r.status === 200).length;
  const avg = (results.reduce((a, r) => a + r.ms, 0) / results.length).toFixed(1);
  const p95 = results.map(r => r.ms).sort((a,b)=>a-b)[Math.floor(results.length*0.95)-1];
  console.table(results.slice(0,10));
  console.log(`Success: ${success}/${total}`);
  console.log(`Avg ms: ${avg}`);
  console.log(`p95 ms: ${p95}`);
  console.log(`Total duration: ${Date.now() - startAll}ms`);
  if (success / total < 0.9) process.exit(1);
})();
