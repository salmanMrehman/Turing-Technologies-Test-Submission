'use client';

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import styles from './style.module.scss';
import LanguageConstants from "@/constants/languageConstants"; // import texts

export type AddNotesData = {
  id: string;
  call_type: 'missed' | 'answered' | 'voice mail' | string;
  durationReadable: string;
  from: string;
  to: string;
  via: string;
  callUrl?: string;
  notes: { id: string; content: string; created_at: string }[];
};

type Props = {
  open: boolean;
  data: AddNotesData | null;
  onClose: () => void;
  onSave: (note: string) => void;
  defaultNote?: string;
  saving?: boolean;
};

export default function AddNotes({
  open,
  data,
  onClose,
  onSave,
  defaultNote = '',
  saving = false,
}: Props) {
  const [note, setNote] = React.useState(defaultNote);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    setNote(defaultNote);
    setTouched(false);
  }, [defaultNote, open]);

  if (!data) return null;

  const labelCase = (v: string) =>
    v === 'voice mail' ? 'Voice Mail' : v.charAt(0).toUpperCase() + v.slice(1);

  const trimmed = note.trim();
  const isEmpty = trimmed.length === 0;
  const showError = touched && isEmpty;

  const handleSave = () => {
    setTouched(true);
    if (isEmpty) return;
    onSave(trimmed);
  };

  const fmt = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  };

  // newest first (optional)
  const notes = [...(data.notes ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: styles.paper }}>
      <DialogTitle className={styles.title}>
        {LanguageConstants.ADD_NOTES_COMPONENT.TITLE}
        <div className={styles.metaTop}>
          <Link href={data.callUrl ?? '#'} underline="none" className={styles.callLink}>
        {LanguageConstants.ADD_NOTES_COMPONENT.CALL_ID(data.id)}
          </Link>
        </div>
        <IconButton onClick={onClose} className={styles.closeBtn} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.row}>
            <div className={styles.label}>{LanguageConstants.ADD_NOTES_COMPONENT.LABELS.CALL_TYPE}</div>
            <div className={styles.valueBlue}>{labelCase(String(data.call_type))}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>{LanguageConstants.ADD_NOTES_COMPONENT.LABELS.DURATION}</div>
            <div className={styles.value}>{data.durationReadable}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>{LanguageConstants.ADD_NOTES_COMPONENT.LABELS.FROM}</div>
            <div className={styles.value}>+{data.from.replace(/^\+/, '')}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>{LanguageConstants.ADD_NOTES_COMPONENT.LABELS.TO}</div>
            <div className={styles.value}>+{data.to.replace(/^\+/, '')}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>{LanguageConstants.ADD_NOTES_COMPONENT.LABELS.VIA}</div>
            <div className={styles.value}>+{data.via.replace(/^\+/, '')}</div>
          </div>
        </div>

        {/* Existing notes (scrollable) */}
            <div className={styles.notesLabelExisting}>{LanguageConstants.ADD_NOTES_COMPONENT.LABELS.NOTES_EXISTING}</div>
        <div className={styles.notesHistoryWrap}>
          {notes.length === 0 ? (
            <div className={styles.emptyNotes}>{LanguageConstants.ADD_NOTES_COMPONENT.NOTES.EMPTY}</div>
          ) : (
            <ul className={styles.notesList} aria-label={LanguageConstants.ADD_NOTES_COMPONENT.LABELS.NOTES_EXISTING}>
              {notes.map(n => (
                <li key={n.id} className={styles.noteItem}>
                  <div className={styles.noteContent}>{n.content}</div>
                  <div className={styles.noteMeta}>{fmt(n.created_at)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add a new note */}
        <div className={styles.notesBlock}>
          <div className={styles.notesLabel}>{LanguageConstants.ADD_NOTES_COMPONENT.LABELS.NOTES_NEW}</div>
          <TextField
            placeholder={LanguageConstants.ADD_NOTES_COMPONENT.PLACEHOLDERS.ADD_NOTE}
            multiline
            minRows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => setTouched(true)}
            error={showError}
            helperText={showError ? LanguageConstants.ADD_NOTES_COMPONENT.ERRORS.EMPTY_NOTE : " "}
            className={styles.notesInput}
            inputProps={{ 'aria-required': true }}
          />
        </div>

        <div className={styles.actions}>
          <Button
            variant="contained"
            disableElevation
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving || isEmpty}
          >
             {LanguageConstants.ADD_NOTES_COMPONENT.BUTTONS.SAVE}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
