/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json", diagnostics: false }]
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"]
}

export default config

