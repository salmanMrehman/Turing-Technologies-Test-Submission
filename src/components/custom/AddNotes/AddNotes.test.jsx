import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddNotes from './index';
import '@testing-library/jest-dom';

jest.mock('@/constants/languageConstants', () => ({
  ADD_NOTES_COMPONENT: {
    TITLE: 'Add Notes',
    CALL_ID: (id) => `Call ID: ${id}`,
    LABELS: {
      CALL_TYPE: 'Call Type',
      DURATION: 'Duration',
      FROM: 'From',
      TO: 'To',
      VIA: 'Via',
      NOTES_EXISTING: 'Existing Notes',
      NOTES_NEW: 'New Note',
    },
    PLACEHOLDERS: {
      ADD_NOTE: 'Write your note...',
    },
    BUTTONS: {
      SAVE: 'Save Note',
    },
    ERRORS: {
      EMPTY_NOTE: 'Note cannot be empty.',
    },
    NOTES: {
      EMPTY: 'No notes yet.',
    },
  },
}));

const mockData = {
  id: 'call_123',
  call_type: 'missed',
  durationReadable: '2 minutes',
  from: '+1234567890',
  to: '+0987654321',
  via: '+1112223333',
  callUrl: 'https://call.url',
  notes: [
    {
      id: 'note_1',
      content: 'Test note 1',
      created_at: '2023-09-01T12:00:00Z',
    },
    {
      id: 'note_2',
      content: 'Test note 2',
      created_at: '2023-09-02T14:30:00Z',
    },
  ],
};

describe('AddNotes', () => {
  it('renders call metadata and existing notes', () => {
    render(<AddNotes open data={mockData} onClose={jest.fn()} onSave={jest.fn()} />);

    // Metadata
    expect(screen.getByText(/Call ID: call_123/i)).toBeInTheDocument();
    expect(screen.getByText('Call Type')).toBeInTheDocument();
    expect(screen.getByText('Missed')).toBeInTheDocument(); // capitalized
    expect(screen.getByText('2 minutes')).toBeInTheDocument();

    // Notes
    expect(screen.getByText('Test note 1')).toBeInTheDocument();
    expect(screen.getByText('Test note 2')).toBeInTheDocument();
  });

  it('does not render if `data` is null', () => {
    const { container } = render(<AddNotes open data={null} onClose={jest.fn()} onSave={jest.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('calls onClose when close icon is clicked', () => {
    const onClose = jest.fn();
    render(<AddNotes open data={mockData} onClose={onClose} onSave={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays validation error for empty note on blur', async () => {
    render(<AddNotes open data={mockData} onClose={jest.fn()} onSave={jest.fn()} />);

    const input = screen.getByPlaceholderText(/write your note/i);
    fireEvent.blur(input);

    await screen.findByText(/note cannot be empty/i);
  });

  it('disables Save button when note is empty', () => {
    render(<AddNotes open data={mockData} onClose={jest.fn()} onSave={jest.fn()} />);

    const saveBtn = screen.getByRole('button', { name: /save note/i });
    expect(saveBtn).toBeDisabled();
  });

  it('saves note when valid input is given', async () => {
    const onSave = jest.fn();
    render(<AddNotes open data={mockData} onClose={jest.fn()} onSave={onSave} />);

    const input = screen.getByPlaceholderText(/write your note/i);
    const saveBtn = screen.getByRole('button', { name: /save note/i });

    fireEvent.change(input, { target: { value: 'This is a new note' } });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('This is a new note');
    });
  });

  it('shows defaultNote in input when provided', () => {
    render(
      <AddNotes
        open
        data={mockData}
        onClose={jest.fn()}
        onSave={jest.fn()}
        defaultNote="Pre-filled note"
      />
    );

    expect(screen.getByDisplayValue('Pre-filled note')).toBeInTheDocument();
  });

  it('disables save button when saving is true', () => {
    render(
      <AddNotes
        open
        data={mockData}
        onClose={jest.fn()}
        onSave={jest.fn()}
        saving={true}
        defaultNote="Note to be saved"
      />
    );

    const saveBtn = screen.getByRole('button', { name: /save note/i });
    expect(saveBtn).toBeDisabled();
  });
});
