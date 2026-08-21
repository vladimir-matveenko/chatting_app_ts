export default {
  preset: "ts-jest/presets/default-esm",

  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  testMatch: ["**/tests/**/*.test.ts"],

  extensionsToTreatAsEsm: [".ts"],

  moduleFileExtensions: ["ts", "js", "json"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  collectCoverageFrom: [
    "src/features/**/*.ts",
    "!src/features/**/tests/**",
    "!src/features/**/*.d.ts",
  ],

  coverageDirectory: "coverage",

  verbose: true,
};
