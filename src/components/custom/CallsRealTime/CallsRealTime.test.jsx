import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import CallsRealtime from './index';
import '@testing-library/jest-dom';
import { useDispatch, useSelector } from 'react-redux';
import { applyCallUpdate } from '@/redux/features/Calls/callsSlice';

const mockBind = jest.fn();
const mockUnbindAll = jest.fn();
const mockSubscribe = jest.fn(() => ({
  bind: mockBind,
  unbind_all: mockUnbindAll,
}));
const mockUnsubscribe = jest.fn();
const mockDisconnect = jest.fn();

jest.mock('pusher-js', () => {
  return jest.fn().mockImplementation(() => ({
    subscribe: mockSubscribe,
    unsubscribe: mockUnsubscribe,
    disconnect: mockDisconnect,
  }));
});

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@/redux/features/Calls/callsSlice', () => ({
  applyCallUpdate: jest.fn((payload) => ({ type: 'CALL_UPDATE', payload })),
}));

describe('CallsRealtime', () => {
  let mockDispatch;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(cleanup);

  it('does not initialize Pusher if accessToken is missing', () => {
    useSelector.mockImplementation(() => ''); // no access token
    render(<CallsRealtime />);
    expect(mockSubscribe).not.toHaveBeenCalled();
  });

  it('initializes Pusher and subscribes to channel if accessToken exists', () => {
    useSelector.mockImplementation(() => 'test-token');

    render(<CallsRealtime />);

    expect(mockSubscribe).toHaveBeenCalledWith('private-aircall');
    expect(mockBind).toHaveBeenCalledWith('update-call', expect.any(Function));
  });

  it('dispatches applyCallUpdate on receiving "update-call" event', () => {
    useSelector.mockImplementation(() => 'test-token');

    let boundCallback;
    mockBind.mockImplementation((eventName, callback) => {
      if (eventName === 'update-call') {
        boundCallback = callback;
      }
    });

    render(<CallsRealtime />);

    const fakePayload = { id: 'call_1', from: '12345' };
    act(() => {
      boundCallback(fakePayload);
    });

    expect(applyCallUpdate).toHaveBeenCalledWith(fakePayload);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CALL_UPDATE',
      payload: fakePayload,
    });
  });

  it('cleans up listeners on unmount', () => {
    useSelector.mockImplementation(() => 'test-token');

    const { unmount } = render(<CallsRealtime />);
    unmount();

    expect(mockUnbindAll).toHaveBeenCalled();
    expect(mockUnsubscribe).toHaveBeenCalledWith('private-aircall');
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
