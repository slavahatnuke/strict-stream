import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        exclude: [...configDefaults.exclude, 'cd/**.spec.ts'],
        include: ['src/**.spec.ts']
    },
})