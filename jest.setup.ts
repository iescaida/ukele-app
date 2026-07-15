import '@testing-library/jest-native/extend-expect';
import '@testing-library/react-native/dont-cleanup-after-each';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
