const path = require('path');

function isCI() {
    return !!process.env.CI;
}

module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: path.join(__dirname, 'src'),
    testRegex: '.*\\.spec\\.ts$',
    modulePathIgnorePatterns: [],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    setupFiles: [],
    collectCoverage: process.env.UNIT_TEST_COLLECT_COVERAGE === 'true',
    collectCoverageFrom: [],
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    moduleNameMapper: {},
    maxWorkers: parseInt(process.env.UNIT_TEST_CONCURRENCY) || 1,
    maxConcurrency: parseInt(process.env.UNIT_TEST_CONCURRENCY) || 1,
    testTimeout: isCI() ? 30e3 : 15e3,
};
