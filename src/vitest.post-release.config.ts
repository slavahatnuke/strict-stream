import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        exclude: [...configDefaults.exclude, 'src/**.spec.ts'],
        include: ['cd/**.spec.ts']
    },
})