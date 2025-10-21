/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  
  moduleNameMapper: {

    '^src/(.*)$': '<rootDir>/src/$1', 
    

    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest', 
      {
        tsconfig: 'tsconfig.app.json', 
        diagnostics: {
            ignoreCodes: [151001] 
        }
      }
    ],
  },
};
export default config;