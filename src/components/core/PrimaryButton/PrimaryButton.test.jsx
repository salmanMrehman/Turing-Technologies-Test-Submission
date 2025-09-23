import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PrimaryButton from './index';
import '@testing-library/jest-dom';

describe('PrimaryButton', () => {
  it('renders the button with children text', () => {
    render(<PrimaryButton>Click Me</PrimaryButton>);

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();

    render(<PrimaryButton onClick={handleClick}>Click Me</PrimaryButton>);

    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the "submit" type correctly', () => {
    render(<PrimaryButton type="submit">Submit</PrimaryButton>);

    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('disables the button when disabled prop is true', () => {
    render(<PrimaryButton disabled>Disabled</PrimaryButton>);

    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
  });

  it('renders with start and end icons', () => {
    const StartIcon = () => <span data-testid="start-icon">Start</span>;
    const EndIcon = () => <span data-testid="end-icon">End</span>;

    render(
      <PrimaryButton startIcon={<StartIcon />} endIcon={<EndIcon />}>
        With Icons
      </PrimaryButton>
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('applies custom background color and paddingY as inline styles', () => {
    render(
      <PrimaryButton bgColor="#123456" paddingY={12}>
        Styled Button
      </PrimaryButton>
    );

    const button = screen.getByRole('button', { name: /styled button/i });

    // Custom CSS variables applied inline
    expect(button).toHaveStyle({ '--btn-bg': '#123456' });
    expect(button).toHaveStyle({ '--btn-py': '12px' });
  });

  it('applies custom styles via customeStyle prop', () => {
    render(
      <PrimaryButton customeStyle={{ fontSize: '20px' }}>
        Styled Text
      </PrimaryButton>
    );

    const button = screen.getByRole('button', { name: /styled text/i });
    expect(button).toHaveStyle({ fontSize: '20px' });
  });

  it('adds fullWidth class when fullWidth is true', () => {
    render(
      <PrimaryButton fullWidth>
        Full Width Button
      </PrimaryButton>
    );

    const button = screen.getByRole('button', { name: /full width button/i });
    expect(button.className).toMatch(/fullWidth/); // assuming `styles.fullWidth` maps to 'fullWidth'
  });
});
