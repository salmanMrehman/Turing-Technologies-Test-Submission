"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Pagination,
} from "@mui/material";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  fetchCalls,
  filterCalls,
  setPage,
  addNote,
  archiveCall,
} from "@/redux/features/Calls/callsSlice";
import ArchiveButton from "@/components/custom/ArchiveButton";
import AddNotes, { AddNotesData } from "@/components/custom/AddNotes";
import { formatMinutesSeconds } from "@/utils/helper";
import PrimaryButton from "@/components/core/PrimaryButton";
import ConfirmDialog from "@/components/custom/ConfirmDialog";
import type { CallItem } from "@/redux/features/Calls/callsSlice";
import LanguageConstants from "@/constants/languageConstants";

const callTypeClassMap: Record<string, string> = {
  missed: styles.missed,
  answered: styles.answered,
};

export default function CallsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { calls, page, perPage, totalCount, status } = useSelector(
    (s: RootState) => s.calls
  );
  const [addNotesOpen, setAddNotesOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<AddNotesData | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [confirming, setConfirming] = React.useState(false);
  const [isArchiving, setIsArchiving] = React.useState<boolean>(false);

  const [filter, setFilterLocal] = useState<
    "all" | "archived" | "unarchived" | "missed" | "answered" | "voice mail"
  >("all");

  const openNotes = (row: CallItem) => {
    const safeNotes = (row.notes || [])
      .filter((n) => n.content.trim().length > 0) // remove empty notes
      .map((note) => ({
        id: note.id || crypto.randomUUID(),
        content: note.content,
        created_at: note.created_at || new Date().toISOString(), // default if missing
      }));

    setSelected({
      id: row.id,
      call_type: row.call_type,
      durationReadable: formatMinutesSeconds(Number(row.duration)),
      from: row.from,
      to: row.to,
      via: row.via,
      callUrl: `#/calls/${row.id}`,
      notes: safeNotes,
    });
    setAddNotesOpen(true);
  };

  const askArchive = (id: string, isArchived?: boolean) => {
    setSelectedId(id);
    setConfirmOpen(true);
    setIsArchiving(isArchived ?? false);
  };

  const handleSave = (note: string) => {
    if (!selected) return;
    dispatch(addNote({ id: selected.id, content: note }));
    setAddNotesOpen(false);
  };

  // fetch when page/perPage changes
  useEffect(() => {
    dispatch(fetchCalls({ page, perPage }));
  }, [dispatch, page, perPage]);
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalCount);
  return (
    <Container className={styles.page} maxWidth="lg">
      <Typography variant="h4" className={styles.title}>
        {LanguageConstants.SIGN_IN_PAGE.PAGE_TITLE}
      </Typography>

      <Box className={styles.filterRow}>
        <Typography component="span" className={styles.filterLabel}>
          Filter by:
          {LanguageConstants.SIGN_IN_PAGE.FILTER.LABEL}
        </Typography>
        <Select
          value={filter}
          onChange={(e) => {
            const val = e.target.value as typeof filter;
            setFilterLocal(val);
            dispatch(filterCalls(val));
          }}
          variant="outlined"
          className={`${styles.select} ${styles.noOutline}`}
          MenuProps={{ disableScrollLock: true }}
        >
          <MenuItem value="all" className={styles.menuItem}>
            {LanguageConstants.SIGN_IN_PAGE.FILTER.ALL}
          </MenuItem>
          <MenuItem value="archived" className={styles.menuItem}>
            {LanguageConstants.SIGN_IN_PAGE.FILTER.ARCHIVED}
          </MenuItem>
          <MenuItem value="unarchived" className={styles.menuItem}>
            {LanguageConstants.SIGN_IN_PAGE.FILTER.UNARCHIVED}
          </MenuItem>
          <MenuItem value="missed" className={styles.menuItem}>
            {LanguageConstants.SIGN_IN_PAGE.FILTER.MISSED}
          </MenuItem>
          <MenuItem value="answered" className={styles.menuItem}>
            {LanguageConstants.SIGN_IN_PAGE.FILTER.ANSWERED}
          </MenuItem>
          <MenuItem value="voice mail" className={styles.menuItem}>
            {LanguageConstants.SIGN_IN_PAGE.FILTER.VOICE_MAIL}
          </MenuItem>
        </Select>
      </Box>

      <Box className={styles.tableWrapper}>
        <Table className={styles.table} aria-label="calls table">
          <TableHead>
            <TableRow className={styles.headRow}>
              <TableCell>
                {LanguageConstants.SIGN_IN_PAGE.TABLE.CALL_TYPE}
              </TableCell>
              <TableCell>
                {LanguageConstants.SIGN_IN_PAGE.TABLE.DIRECTION}
              </TableCell>
              <TableCell>
                {LanguageConstants.SIGN_IN_PAGE.TABLE.DURATION}
              </TableCell>
              <TableCell>{LanguageConstants.SIGN_IN_PAGE.TABLE.FROM}</TableCell>
              <TableCell>{LanguageConstants.SIGN_IN_PAGE.TABLE.TO}</TableCell>
              <TableCell>{LanguageConstants.SIGN_IN_PAGE.TABLE.VIA}</TableCell>
              <TableCell>
                {LanguageConstants.SIGN_IN_PAGE.TABLE.CREATED_AT}
              </TableCell>
              <TableCell>
                {LanguageConstants.SIGN_IN_PAGE.TABLE.STATUS}
              </TableCell>
              <TableCell align="right">
                {LanguageConstants.SIGN_IN_PAGE.TABLE.ACTIONS}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {calls &&
              calls?.map((row) => (
                <TableRow key={row.id} className={styles.bodyRow}>
                  <TableCell
                    className={
                      callTypeClassMap[row.call_type.toLowerCase()] ||
                      styles.voiceMail
                    }
                  >
                    {row.call_type}
                  </TableCell>

                  <TableCell>
                    <Link className={styles.link} href="#" underline="none">
                      {row.direction === "inbound" ? "Inbound" : "Outbound"}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <div className={styles.durationMain}>
                      {formatMinutesSeconds(Number(row.duration))}
                    </div>
                    <Link
                      className={styles.secondsLink}
                      href="#"
                      underline="none"
                    >
                      ({row.duration} seconds)
                    </Link>
                  </TableCell>

                  <TableCell>{row.from}</TableCell>
                  <TableCell>{row.to}</TableCell>
                  <TableCell>{row.via}</TableCell>
                  <TableCell>{row.created_at?.split("T")[0]}</TableCell>

                  <TableCell>
                    <ArchiveButton
                      archived={!!row.is_archived}
                      onClick={() => askArchive(row.id, row.is_archived)}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <PrimaryButton type="button" onClick={() => openNotes(row)}>
                      Add Note
                    </PrimaryButton>
                  </TableCell>
                </TableRow>
              ))}

            {status === "loading" && (
              <TableRow>
                <TableCell colSpan={9}>Loading…</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination control */}

      {/* Pagination block */}
      {filter === "all" && totalPages > 1 && (
        <Box className={styles.paginationWrap}>
          <Pagination
            className={styles.pagination}
            count={totalPages}
            page={page}
            onChange={(_e, newPage) => dispatch(setPage(newPage))}
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
          />
          <Typography className={styles.resultsText}>
            {LanguageConstants.SIGN_IN_PAGE.RESULTS(start, end, totalCount)}
          </Typography>
        </Box>
      )}
      <AddNotes
        open={addNotesOpen}
        data={selected}
        onClose={() => setAddNotesOpen(false)}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedId(null);
        }}
        onConfirm={async () => {
          if (!selectedId) return;
          setConfirming(true);
          try {
            await dispatch(archiveCall({ id: selectedId, isArchiving }));
            // success -> dialog closes; state updated by reducer
            setConfirmOpen(false);
            setSelectedId(null);
          } finally {
            setConfirming(false);
          }
        }}
        confirming={confirming}
        title={LanguageConstants.SIGN_IN_PAGE?.CONFIRM_DIALOG.TITLE}
        message={LanguageConstants.SIGN_IN_PAGE?.CONFIRM_DIALOG.MESSAGE}
        confirmText={
          LanguageConstants.SIGN_IN_PAGE?.CONFIRM_DIALOG.CONFIRM_TEXT
        }
      />
    </Container>
  );
}
