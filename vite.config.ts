import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh';
import envCompatible from 'vite-plugin-env-compatible';

// https://vitejs.dev/config/
export default defineConfig({
  // eslint-disable-next-line no-sparse-arrays
  plugins: [reactRefresh(), envCompatible()],
  css: {
    modules: {},
  },
});
