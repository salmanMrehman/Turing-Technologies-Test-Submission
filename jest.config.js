// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!<rootDir>/out/**',
    '!<rootDir>/.next/**',
    '!<rootDir>/*.config.js',
    '!<rootDir>/coverage/**',
  ],

 moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1', // 👈 tells Jest what @/ means
  '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  '^.+\\.(css|sass|scss)$': '<rootDir>/src/__mocks__/styleMock.js',
  '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$':
    '<rootDir>/src/__mocks__/fileMock.js',
},

  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],

  testEnvironment: 'jsdom',

  transform: {
    // ✅ Use babel-jest with Next.js preset to handle JSX/TS
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(uuid)/)', // ✅ Allow 'uuid' to be transformed
    '^.+\\.module\\.(css|sass|scss)$', // ✅ Don't transform CSS modules
  ],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // ✅ Test setup
};
