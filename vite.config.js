import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cpSync, mkdirSync, writeFileSync } from 'fs';

const sitesOutput = () => ({
  name: 'sites-output',
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.url === '/agendarconsulta-escura') {
        response.statusCode = 308;
        response.setHeader('Location', '/agendarconsulta-escura/');
        response.end();
        return;
      }
      if (request.url?.startsWith('/agendarconsulta-escura/')) {
        request.url = request.url.replace('/agendarconsulta-escura/', '/agendarconsulta/');
      }
      next();
    });
  },
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
    if (url.pathname === "/agendarconsulta-escura") {
      return Response.redirect(url.origin + "/agendarconsulta-escura/", 308);
    }
    if (url.pathname.startsWith("/agendarconsulta-escura/")) {
      url.pathname = "/agendarconsulta/";
      return env.ASSETS.fetch(new Request(url, request));
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
