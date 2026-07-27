import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cpSync, mkdirSync, writeFileSync } from 'fs';

const sitesOutput = () => ({
  name: 'sites-output',
  closeBundle() {
    mkdirSync(resolve(__dirname, 'dist/server'), { recursive: true });
    mkdirSync(resolve(__dirname, 'dist/.openai'), { recursive: true });
    writeFileSync(
      resolve(__dirname, 'dist/server/index.js'),
      `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/agendarconsulta") {
      return Response.redirect(url.origin + "/agendarconsulta/", 308);
    }
    return env.ASSETS.fetch(request);
  }
};
`,
    );
    cpSync(
      resolve(__dirname, '.openai/hosting.json'),
      resolve(__dirname, 'dist/.openai/hosting.json'),
    );
  },
});

export default defineConfig({
  plugins: [sitesOutput()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        consulta: resolve(__dirname, 'consulta.html'),
        agendarconsulta: resolve(__dirname, 'agendarconsulta/index.html'),
      },
    },
  },
  server: {
    open: false,
  },
});
