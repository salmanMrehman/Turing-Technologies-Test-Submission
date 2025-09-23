import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ArchiveButton from './index';
import '@testing-library/jest-dom';

describe('ArchiveButton', () => {
  it('renders "Archived" label when archived is true', () => {
    render(<ArchiveButton archived={true} onClick={() => {}} />);
    expect(screen.getByRole('button', { name: /archived/i })).toBeInTheDocument();
  });

  it('renders "Unarchive" label when archived is false', () => {
    render(<ArchiveButton archived={false} onClick={() => {}} />);
    expect(screen.getByRole('button', { name: /unarchive/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked and not disabled', () => {
    const handleClick = jest.fn();
    render(<ArchiveButton archived={false} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button', { name: /unarchive/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<ArchiveButton archived={false} onClick={handleClick} disabled />);

    const button = screen.getByRole('button', { name: /unarchive/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading is true', () => {
    const handleClick = jest.fn();
    render(<ArchiveButton archived={true} onClick={handleClick} loading />);

    const button = screen.getByRole('button', { name: /archived/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows spinner when loading is true', () => {
    render(<ArchiveButton archived={false} onClick={() => {}} loading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('uses custom labels when provided', () => {
    render(
      <ArchiveButton
        archived={true}
        onClick={() => {}}
        archivedLabel="Already Archived"
        unarchiveLabel="Reactivate"
      />
    );

    expect(screen.getByRole('button', { name: /already archived/i })).toBeInTheDocument();
  });
});
