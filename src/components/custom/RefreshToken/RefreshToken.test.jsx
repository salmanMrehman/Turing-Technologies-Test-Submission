import React from 'react';
import { render } from '@testing-library/react';
import TokenRefresher from './index';
import { useSelector, useDispatch } from 'react-redux';
import { refreshAccessToken } from '@/redux/features/Auth/authSlice';

// Mock redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock action
jest.mock('@/redux/features/Auth/authSlice', () => ({
  refreshAccessToken: jest.fn(() => ({ type: 'auth/refreshAccessToken' })),
}));

describe('TokenRefresher', () => {
  let mockDispatch;

  beforeEach(() => {
    jest.useFakeTimers(); // Important: mock timers
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // clean up
    jest.useRealTimers();
  });

  it('does nothing if refresh_token or expiresAt is missing', () => {
    useSelector.mockImplementation((cb) =>
      cb({ auth: { refresh_token: null, expiresAt: null } })
    );

    render(<TokenRefresher />);

    expect(mockDispatch).not.toHaveBeenCalled();
    jest.advanceTimersByTime(10000); // simulate time
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('schedules a refresh before token expires', () => {
    const now = Date.now();
    const expiresAt = now + 60_000; // 1 minute later

    useSelector.mockImplementation((cb) =>
      cb({ auth: { refresh_token: 'refresh', expiresAt } })
    );

    render(<TokenRefresher />);

    // Should schedule refresh at (expiresAt - now - EARLY_SKEW_MS)
    jest.advanceTimersByTime(50_000); // 60s - 10s
    expect(mockDispatch).toHaveBeenCalledWith(refreshAccessToken());
  });

  it('uses minimum delay if token is near expiry', () => {
    const now = Date.now();
    const expiresAt = now + 9_000; // less than EARLY_SKEW

    useSelector.mockImplementation((cb) =>
      cb({ auth: { refresh_token: 'refresh', expiresAt } })
    );

    render(<TokenRefresher />);

    jest.advanceTimersByTime(5_000); // MIN_DELAY_MS
    expect(mockDispatch).toHaveBeenCalledWith(refreshAccessToken());
  });

  it('dispatches refresh on window focus if token is expired', () => {
    const now = Date.now();
    const expiresAt = now - 1000; // already expired

    useSelector.mockImplementation((cb) =>
      cb({ auth: { refresh_token: 'refresh', expiresAt } })
    );

    render(<TokenRefresher />);

    const event = new Event('focus');
    window.dispatchEvent(event);

    expect(mockDispatch).toHaveBeenCalledWith(refreshAccessToken());
  });

  it('does not refresh on focus if token is still valid', () => {
    const now = Date.now();
    const expiresAt = now + 60_000;

    useSelector.mockImplementation((cb) =>
      cb({ auth: { refresh_token: 'refresh', expiresAt } })
    );

    render(<TokenRefresher />);

    const event = new Event('focus');
    window.dispatchEvent(event);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
