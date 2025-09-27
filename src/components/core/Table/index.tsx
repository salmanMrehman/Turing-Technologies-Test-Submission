'use client';

import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
} from '@mui/material';
import styles from './style.module.scss';
import { formatMinutesSeconds } from '@/utils/helper';
import ArchiveButton from '@/components/custom/ArchiveButton';
import PrimaryButton from '@/components/core/PrimaryButton';
import type { CallItem } from '@/redux/features/Calls/callsSlice';
import LanguageConstants from "@/constants/languageConstants";

interface Header {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

interface Props {
  selectedFilter: string;
  headers: Header[];
  rows: CallItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  onOpenNotes: (row: CallItem) => void;
  onArchive: (id: string, isArchived?: boolean) => void;
  callTypeClassMap: Record<string, string>;
}

export default function CallsTable({
  selectedFilter,
  headers,
  rows,
  status,
  onOpenNotes,
  onArchive,
  callTypeClassMap,
}: Props) {
  return (
    <Table className={styles.table} aria-label="calls table">
      <TableHead>
        <TableRow className={styles.headRow}>
          {headers.map((h) => (
            <TableCell key={h.key} align={h.align ?? 'left'}>
              {h.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {rows?.map((row) => (
          <TableRow key={row.id} className={styles.bodyRow}>
            {/* Call Type */}
            <TableCell
              className={
                callTypeClassMap[selectedFilter !== LanguageConstants.SIGN_IN_PAGE.FILTER_VALUES.ALL ? selectedFilter : row.call_type.toLowerCase()] ||
                styles.voiceMail
              }
            >
              {selectedFilter !== LanguageConstants.SIGN_IN_PAGE.FILTER_VALUES.ALL ? selectedFilter: row.call_type}
            </TableCell>

            {/* Direction */}
            <TableCell>
              <Link className={styles.link} href="#" underline="none">
                {row.direction === 'inbound' ? 'Inbound' : 'Outbound'}
              </Link>
            </TableCell>

            {/* Duration */}
            <TableCell>
              <div className={styles.durationMain}>
                {formatMinutesSeconds(Number(row.duration))}
              </div>
              <Link className={styles.secondsLink} href="#" underline="none">
                ({row.duration} seconds)
              </Link>
            </TableCell>

            {/* From */}
            <TableCell>{row.from}</TableCell>
            {/* To */}
            <TableCell>{row.to}</TableCell>
            {/* Via */}
            <TableCell>{row.via}</TableCell>
            {/* Created At */}
            <TableCell>{row.created_at?.split('T')[0]}</TableCell>

            {/* Archive button */}
            <TableCell>
              <ArchiveButton
                archived={!!row.is_archived}
                onClick={() => onArchive(row.id, row.is_archived)}
              />
            </TableCell>

            {/* Actions */}
            <TableCell align="right">
              <PrimaryButton type="button" onClick={() => onOpenNotes(row)}>
                Add Note
              </PrimaryButton>
            </TableCell>
          </TableRow>
        ))}

        {status === 'loading' && (
          <TableRow>
            <TableCell colSpan={headers.length}>Loading…</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
