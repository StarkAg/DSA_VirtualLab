import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-only middleware so /api/execute works under `npm run dev` (Vite doesn't
// run Vercel functions). Mirrors api/execute.js using the same core.
function apiDevPlugin() {
  return {
    name: 'api-exec-dev',
    configureServer(server) {
      server.middlewares.use('/api/execute', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', async () => {
          try {
            const { runExecution } = await import('./api/_exec.js');
            const out = await runExecution(JSON.parse(body || '{}'));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(out));
          } catch (e) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  server: { port: 5174, open: false },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          codemirror: [
            '@uiw/react-codemirror',
            '@codemirror/lang-cpp',
            '@codemirror/lang-java',
            '@codemirror/lang-python',
            '@uiw/codemirror-theme-github',
          ],
        },
      },
    },
  },
});
