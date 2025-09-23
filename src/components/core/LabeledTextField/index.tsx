'use client';

import * as React from 'react';
import { Box, Typography, TextField, InputAdornment, TextFieldProps } from '@mui/material';
import styles from './style.module.scss';

type Props = {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: TextFieldProps['type'];
  icon?: React.ReactNode; // e.g. <AccountCircleIcon />
} & Omit<TextFieldProps, 'id' | 'label' | 'placeholder' | 'type'>;

export default function LabeledTextField({
  id,
  label,
  required,
  placeholder,
  type = 'text',
  icon,
  ...textFieldProps
}: Props) {
  return (
    <Box className={styles.field}>
      <Typography component="label" htmlFor={id} className={styles.label}>
        {required && <Box component="span" className={styles.required}>*</Box>}
        {label}
      </Typography>

      <TextField
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className={styles.textField}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">
              <span className={styles.icon}>{icon}</span>
            </InputAdornment>
          ) : undefined,
        }}
        {...textFieldProps}
      />
    </Box>
  );
}
