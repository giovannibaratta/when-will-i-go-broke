module.exports = {
  roots: ["<rootDir>/src"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/mocks/**"
  ],
  testEnvironment: "jsdom",
  modulePaths: ["<rootDir>/src"],
  transform: {
    ".*\\.(tsx?)$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: "automatic"
            }
          }
        }
      }
    ]
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  resetMocks: true,
  moduleNameMapper: {
    // Css files need to be handled with the library identity-obj-proxy
    // Otherwise they will result in errors when running tests
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
}
