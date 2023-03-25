/**
 * @type import("jest").Config
 */
const cfg = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['es-jest', { jsx: 'automatic' }],
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  modulePaths: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'js'],
};

module.exports = cfg;