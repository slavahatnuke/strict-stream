import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'src/**.spec.ts', 'src/**/*.spec.ts'],
  },
});
