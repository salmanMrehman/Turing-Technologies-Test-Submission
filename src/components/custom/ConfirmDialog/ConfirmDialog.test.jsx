import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from './index';
import '@testing-library/jest-dom';

jest.mock('@/constants/languageConstants', () => ({
  SIGN_IN_PAGE: {
    CONFIRM_DIALOG: {
      TITLE: 'Are you sure?',
      MESSAGE: 'This action cannot be undone.',
      CONFIRM_TEXT: 'Yes, Confirm',
      CANCEL: 'Cancel',
    },
  },
}));

describe('ConfirmDialog', () => {
  const onCancel = jest.fn();
  const onConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when `open` is false', () => {
    const { container } = render(
      <ConfirmDialog open={false} onCancel={onCancel} onConfirm={onConfirm} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders with default texts when open', () => {
    render(<ConfirmDialog open onCancel={onCancel} onConfirm={onConfirm} />);

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /yes, confirm/i })).toBeInTheDocument();
  });

  it('renders with custom title, message, and button texts', () => {
    render(
      <ConfirmDialog
        open
        title="Custom Title"
        message="Custom message body."
        cancelText="No"
        confirmText="Yes"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message body.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /no/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ConfirmDialog open onCancel={onCancel} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmDialog open onCancel={onCancel} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole('button', { name: /yes, confirm/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables confirm button when confirming is true', () => {
    render(
      <ConfirmDialog open confirming onCancel={onCancel} onConfirm={onConfirm} />
    );

    const confirmButton = screen.getByRole('button', { name: /yes, confirm/i });
    expect(confirmButton).toBeDisabled();
  });
});
