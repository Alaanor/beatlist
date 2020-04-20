module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/libraries/os/pathResolver/',
  ],
  resolver: 'jest-webpack-resolver',
  jestWebpackResolver: {
    silent: true,
    webpackConfig: './node_modules/@vue/cli-service/webpack.config.js',
  },
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!vue|blister.js).+(js|jsx)$',
  ],
};
