'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import cx from 'clsx';
import styles from './style.module.scss';

type Props = {
  archived: boolean;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  archivedLabel?: string;
  unarchiveLabel?: string;
};

export default function ArchiveButton({
  archived,
  onClick,
  className,
  disabled,
  loading,
  archivedLabel = 'Archived',
  unarchiveLabel = 'Unarchive',
}: Props) {
  const label = archived ? archivedLabel : unarchiveLabel;

  // avoid primary color so no blue
  const variant = archived ? 'contained' : 'text';

  return (
    <Button
      variant={variant}
      color="inherit"
      disableElevation
      onClick={onClick}
      disabled={disabled || loading}
      className={cx(className, archived ? styles.archived : styles.unarchived)}
      aria-pressed={archived}
      title={label}
    >
      {loading ? <CircularProgress size={14} className={styles.spinner} /> : label}
    </Button>
  );
}
