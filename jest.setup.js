import '@testing-library/jest-dom';

// jest.setup.js or your test file
import fetchMock from 'jest-fetch-mock';

jest.setTimeout(10000); // increase due to ShowHideTableColumns.test.jsx test failing
fetchMock.enableMocks();
