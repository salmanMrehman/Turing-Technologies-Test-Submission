import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureMockStore from 'redux-mock-store';
import LabeledTextField from './index';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // optional icon for testing

const mockStore = configureMockStore();
const store = mockStore({}); // Not used directly here, but included for future Redux usage

describe('LabeledTextField', () => {
  it('renders the label and placeholder correctly', () => {
    render(
      <LabeledTextField
        id="username"
        label="Username"
        placeholder="Enter username"
      />
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
  });

  it('shows required indicator when required is true', () => {
    render(
      <LabeledTextField
        id="email"
        label="Email"
        placeholder="Enter email"
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
  });

  it('renders icon if provided', () => {
    render(
      <LabeledTextField
        id="with-icon"
        label="With Icon"
        placeholder="Enter something"
        icon={<AccountCircleIcon data-testid="start-icon" />}
      />
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('uses the correct input type when passed', () => {
    render(
      <LabeledTextField
        id="password"
        label="Password"
        placeholder="Enter password"
        type="password"
      />
    );

    const input = screen.getByPlaceholderText(/enter password/i);
    expect(input).toHaveAttribute('type', 'password');
  });
});
