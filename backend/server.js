import { createApp } from './src/app.js';
import { env } from './src/config/env.js';

const { server } = createApp();

server.listen(env.port, env.host, () => {
  console.log(`API REST Sprint 2 (Échele Camello · Grupo 8) escuchando en http://localhost:${env.port}`);
  console.log(`Documentación OpenAPI interactiva disponible en http://localhost:${env.port}/api/docs`);
});
