'use client';
import React from 'react';
import { Select, MenuItem, Typography, Box, SelectChangeEvent } from '@mui/material';
import styles from './style.module.scss';

type Option = { value: string; label: string };

interface Props {
  value: string;
  options: Option[];
  onChange: (val: string) => void;
  label?: string;
}

export default function CallsFilterSelect({ value, options, onChange, label }: Props) {
  const handleChange = (e: SelectChangeEvent<string>) => {
    onChange(e.target.value);
  };

  return (
    <Box className={styles.filterRow}>
      {label && (
        <Typography component="span" className={styles.filterLabel}>
          {label}
        </Typography>
      )}
      <Select
        value={value}
        onChange={handleChange}
        variant="outlined"
        className={`${styles.select} ${styles.noOutline}`}
        MenuProps={{ disableScrollLock: true }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} className={styles.menuItem}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
