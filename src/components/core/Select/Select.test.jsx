import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CallsFilterSelect from './index';
import '@testing-library/jest-dom';

describe('CallsFilterSelect', () => {
  const options = [
    { value: 'all', label: 'All Calls' },
    { value: 'missed', label: 'Missed' },
    { value: 'answered', label: 'Answered' },
  ];

  it('renders label when provided', () => {
    render(
      <CallsFilterSelect
        value="all"
        options={options}
        onChange={jest.fn()}
        label="Filter Calls"
      />
    );
    expect(screen.getByText(/filter calls/i)).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    render(<CallsFilterSelect value="all" options={options} onChange={jest.fn()} />);
    expect(screen.queryByText(/filter calls/i)).not.toBeInTheDocument();
  });

  it('renders the correct selected value', () => {
    render(<CallsFilterSelect value="missed" options={options} onChange={jest.fn()} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Missed');
  });

  it('renders all options in dropdown', () => {
    render(<CallsFilterSelect value="all" options={options} onChange={jest.fn()} />);
    fireEvent.mouseDown(screen.getByRole('combobox')); // open dropdown
    expect(screen.getByRole('option', { name: /all calls/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /missed/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /answered/i })).toBeInTheDocument();
  });

  it('calls onChange with selected value', () => {
    const handleChange = jest.fn();
    render(<CallsFilterSelect value="all" options={options} onChange={handleChange} />);
    fireEvent.mouseDown(screen.getByRole('combobox')); // open dropdown
    fireEvent.click(screen.getByRole('option', { name: /missed/i }));
    expect(handleChange).toHaveBeenCalledWith('missed');
  });
});
