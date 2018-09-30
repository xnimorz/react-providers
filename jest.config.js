module.exports = {
  roots: ['<rootDir>/test'],
  setupTestFrameworkScriptFile: '<rootDir>/test/setupEnzyme.ts',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '.+test.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
