'use client';

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import styles from './style.module.scss';
import LanguageConstants from "@/constants/languageConstants";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirming?: boolean;
};

export default function ConfirmDialog({
  open,
  title = LanguageConstants.SIGN_IN_PAGE?.CONFIRM_DIALOG.TITLE,
  message = LanguageConstants.SIGN_IN_PAGE?.CONFIRM_DIALOG.MESSAGE,
  confirmText = LanguageConstants.SIGN_IN_PAGE?.CONFIRM_DIALOG.CONFIRM_TEXT,
  cancelText = LanguageConstants.SIGN_IN_PAGE?.CONFIRM_DIALOG.CANCEL,
  onCancel,
  onConfirm,
  confirming = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} classes={{ paper: styles.paper }}>
      <DialogTitle className={styles.title}>{title}</DialogTitle>
      <DialogContent className={styles.content}>
        <p className={styles.message}>{message}</p>
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button onClick={onCancel} className={styles.cancelBtn}> {cancelText} </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={onConfirm}
          disabled={confirming}
          className={styles.confirmBtn}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
