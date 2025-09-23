'use client';

import * as React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import cx from 'clsx';
import styles from './style.module.scss';

type Props = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: ButtonProps['variant'];
  disabled?: boolean;

  /** customizations */
  bgColor?: string;                    // background color
  paddingY?: number | string;          // top/bottom padding (e.g. 8 or '10px')
  fullWidth?: boolean;
  customeStyle?: React.CSSProperties;  // keep your existing override
};

type Color = string;

export default function PrimaryButton({
  children,
  onClick,
  type = 'button',
  startIcon,
  endIcon,
  variant = 'contained',
  disabled,
  bgColor,
  paddingY,
  fullWidth,
  className,
  customeStyle,
}: Props) {
  // inject CSS variables for the module to use
  const cssVars: React.CSSProperties = {
    ...(bgColor ? ({ ['--btn-bg' as Color]: bgColor } as React.CSSProperties) : {}),
    ...(paddingY !== undefined
      ? ({
          ['--btn-py' as Color]:
            typeof paddingY === 'number' ? `${paddingY}px` : paddingY,
        } as React.CSSProperties)
      : {}),
  };

  return (
    <Button
      variant={variant}
      color="inherit"
      disableElevation
      onClick={onClick}
      type={type}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled}
      className={cx(styles.button, fullWidth && styles.fullWidth, className)}
      style={{ ...cssVars, ...customeStyle }}
    >
      {children}
    </Button>
  );
}
