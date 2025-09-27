import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CallsTable from './index';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('@/utils/helper', () => ({
  formatMinutesSeconds: jest.fn((s) => `${s}m ${s}s`),
}));

jest.mock('@/components/custom/ArchiveButton', () => (props) => (
  <button onClick={props.onClick} data-testid="archive-btn">
    {props.archived ? 'Unarchive' : 'Archive'}
  </button>
));

jest.mock('@/components/core/PrimaryButton', () => (props) => (
  <button onClick={props.onClick} type="button">
    {props.children}
  </button>
));

jest.mock('@/constants/languageConstants', () => ({
  SIGN_IN_PAGE: {
    FILTER_VALUES: {
      ALL: 'All',
    },
  },
}));

describe('CallsTable', () => {
  const headers = [
    { key: 'type', label: 'Type' },
    { key: 'direction', label: 'Direction' },
    { key: 'duration', label: 'Duration' },
    { key: 'from', label: 'From' },
    { key: 'to', label: 'To' },
    { key: 'via', label: 'Via' },
    { key: 'created_at', label: 'Date' },
    { key: 'actions', label: 'Actions', align: 'right' },
  ];

  const rows = [
    {
      id: '1',
      call_type: 'missed',
      direction: 'inbound',
      duration: '60',
      from: '123',
      to: '456',
      via: '789',
      created_at: '2023-09-01T10:00:00Z',
      is_archived: false,
    },
  ];

  const callTypeClassMap = {
    missed: 'missedClass',
    answered: 'answeredClass',
  };

  it('renders table headers', () => {
    render(
      <CallsTable
        selectedFilter="All"
        headers={headers}
        rows={rows}
        status="idle"
        onOpenNotes={jest.fn()}
        onArchive={jest.fn()}
        callTypeClassMap={callTypeClassMap}
      />
    );

    headers.forEach((h) => {
      expect(screen.getByText(h.label)).toBeInTheDocument();
    });
  });

  it('renders a row with correct call data', () => {
    render(
      <CallsTable
        selectedFilter="All"
        headers={headers}
        rows={rows}
        status="idle"
        onOpenNotes={jest.fn()}
        onArchive={jest.fn()}
        callTypeClassMap={callTypeClassMap}
      />
    );

    expect(screen.getByText('missed')).toBeInTheDocument();
    expect(screen.getByText(/Inbound/)).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
    expect(screen.getByText('789')).toBeInTheDocument();
    expect(screen.getByText('2023-09-01')).toBeInTheDocument();
    expect(screen.getByText(/60m 60s/)).toBeInTheDocument(); // from mocked helper
  });

  it('calls onArchive when archive button clicked', () => {
    const onArchive = jest.fn();

    render(
      <CallsTable
        selectedFilter="All"
        headers={headers}
        rows={rows}
        status="idle"
        onOpenNotes={jest.fn()}
        onArchive={onArchive}
        callTypeClassMap={callTypeClassMap}
      />
    );

    fireEvent.click(screen.getByTestId('archive-btn'));
    expect(onArchive).toHaveBeenCalledWith('1', false);
  });

  it('calls onOpenNotes when Add Note clicked', () => {
    const onOpenNotes = jest.fn();

    render(
      <CallsTable
        selectedFilter="All"
        headers={headers}
        rows={rows}
        status="idle"
        onOpenNotes={onOpenNotes}
        onArchive={jest.fn()}
        callTypeClassMap={callTypeClassMap}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /add note/i }));
    expect(onOpenNotes).toHaveBeenCalledWith(rows[0]);
  });

  it('renders "Loading…" row when status is loading', () => {
    render(
      <CallsTable
        selectedFilter="All"
        headers={headers}
        rows={[]}
        status="loading"
        onOpenNotes={jest.fn()}
        onArchive={jest.fn()}
        callTypeClassMap={callTypeClassMap}
      />
    );

    expect(screen.getByText(/loading…/i)).toBeInTheDocument();
  });

  it('applies correct class based on selectedFilter', () => {
    render(
      <CallsTable
        selectedFilter="missed"
        headers={headers}
        rows={rows}
        status="idle"
        onOpenNotes={jest.fn()}
        onArchive={jest.fn()}
        callTypeClassMap={callTypeClassMap}
      />
    );

    // class should come from callTypeClassMap
    const cell = screen.getByText('missed').closest('td');
    expect(cell.className).toContain('missedClass');
  });
});
