import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement ResizeObserver — react-resizable-panels needs it
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
