module.exports = {
    require: ['ts-node/register', 'tsconfig-paths/register'],
    reporter: 'allure-mocha',
    timeout: 60000,
    spec: 'tests/specs/**/*.spec.ts',
    reporterOptions: {
        resultsDir: './allure-results',
    },
};
