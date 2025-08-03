import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer'; // Importar visualizer
import { theme } from '@chakra-ui/react';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'bundle-stats.html', // Nombre del archivo de salida
      open: true, // Abrir automáticamente el archivo en el navegador después del build
      gzipSize: true, // Mostrar el tamaño gzip
      brotliSize: true, // Mostrar el tamaño brotli
    }),
  ],
  resolve: {
    alias: {
      routes: path.resolve(__dirname, './src/routes'), // Alias para routes
      variables: path.resolve(__dirname, './src/variables'), // Alias para variables
      layouts: path.resolve(__dirname, './src/layouts'), // Alias para layouts
      views: path.resolve(__dirname, './src/views'), // Alias para la carpeta views
      components: path.resolve(__dirname, './src/components'), // Alias para componentes
      contexts: path.resolve(__dirname, './src/contexts'), // Alias para contextos
      assets: path.resolve(__dirname, './src/assets'), // Alias para assets
      hooks: path.resolve(__dirname, './src/hooks'), // Alias para hooks
      types: path.resolve(__dirname, './src/types'), // Alias para types
      themes: path.resolve(__dirname, './src/themes'),
      api: path.resolve(__dirname, './src/api'), 
    },
  },
  server: {
    port: 10000, // Puerto del servidor de desarrollo
    open: true, // Abre el navegador automáticamente
    host: true,
  },
  build: {
    outDir: 'build', // Carpeta de salida para el build
    sourcemap: true, // Generar sourcemaps para depuración
  },
});
