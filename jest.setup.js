import "@testing-library/jest-dom";

// mock fetch globally
global.fetch = jest.fn();

// reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
