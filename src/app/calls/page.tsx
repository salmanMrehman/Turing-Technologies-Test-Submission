"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Pagination } from "@mui/material";
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
import AddNotes, { AddNotesData } from "@/components/custom/AddNotes";
import { formatMinutesSeconds } from "@/utils/helper";
import ConfirmDialog from "@/components/custom/ConfirmDialog";
import type { CallItem } from "@/redux/features/Calls/callsSlice";
import LanguageConstants from "@/constants/languageConstants";
import Select from "@/components/core/Select";
import Table from "@/components/core/Table";

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

  interface Header {
    key: string;
    label: string;
    align?: "left" | "right" | "center";
  }

  const [filter, setFilterLocal] = useState(
    LanguageConstants.SIGN_IN_PAGE.FILTER_VALUES.ALL
  );

  const filterOptions = [
    {
      value: LanguageConstants.SIGN_IN_PAGE.FILTER_VALUES.ALL,
      label: LanguageConstants.SIGN_IN_PAGE.FILTER.ALL,
    },
    {
      value: LanguageConstants.SIGN_IN_PAGE.FILTER_VALUES.ARCHIVED,
      label: LanguageConstants.SIGN_IN_PAGE.FILTER.ARCHIVED,
    },
    {
      value: LanguageConstants.SIGN_IN_PAGE.FILTER_VALUES.UNARCHIVED,
      label: LanguageConstants.SIGN_IN_PAGE.FILTER.UNARCHIVED,
    },
    {
      value: LanguageConstants.SIGN_IN_PAGE.FILTER_VALUES.MISSED,
      label: LanguageConstants.SIGN_IN_PAGE.FILTER.MISSED,
    },
    {
      value: LanguageConstants.SIGN_IN_PAGE.FILTER_VALUES.ANSWERED,
      label: LanguageConstants.SIGN_IN_PAGE.FILTER.ANSWERED,
    },
    {
      value: LanguageConstants.SIGN_IN_PAGE.FILTER_VALUES.VOICE_MAIL,
      label: LanguageConstants.SIGN_IN_PAGE.FILTER.VOICE_MAIL,
    },
  ];

  const headers: Header[] = [
    {
      key: LanguageConstants.SIGN_IN_PAGE.TABLE_HEADER_KEY.CALL_TYPE,
      label: LanguageConstants.SIGN_IN_PAGE.TABLE.CALL_TYPE,
    },
    {
      key: LanguageConstants.SIGN_IN_PAGE.TABLE_HEADER_KEY.CALL_TYPE,
      label: LanguageConstants.SIGN_IN_PAGE.TABLE.DIRECTION,
    },
    {
      key: LanguageConstants.SIGN_IN_PAGE.TABLE_HEADER_KEY.CALL_TYPE,
      label: LanguageConstants.SIGN_IN_PAGE.TABLE.DURATION,
    },
    {
      key: LanguageConstants.SIGN_IN_PAGE.TABLE_HEADER_KEY.CALL_TYPE,
      label: LanguageConstants.SIGN_IN_PAGE.TABLE.FROM,
    },
    {
      key: LanguageConstants.SIGN_IN_PAGE.TABLE_HEADER_KEY.CALL_TYPE,
      label: LanguageConstants.SIGN_IN_PAGE.TABLE.TO,
    },
    {
      key: LanguageConstants.SIGN_IN_PAGE.TABLE_HEADER_KEY.CALL_TYPE,
      label: LanguageConstants.SIGN_IN_PAGE.TABLE.VIA,
    },
    {
      key: LanguageConstants.SIGN_IN_PAGE.TABLE_HEADER_KEY.CALL_TYPE,
      label: LanguageConstants.SIGN_IN_PAGE.TABLE.CREATED_AT,
    },
    {
      key: LanguageConstants.SIGN_IN_PAGE.TABLE_HEADER_KEY.CALL_TYPE,
      label: LanguageConstants.SIGN_IN_PAGE.TABLE.STATUS,
    },
    {
      key: LanguageConstants.SIGN_IN_PAGE.TABLE_HEADER_KEY.CALL_TYPE,
      label: LanguageConstants.SIGN_IN_PAGE.TABLE.ACTIONS,
      align: "right" as const,
    },
  ];

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

      <Select
        value={filter}
        options={filterOptions}
        onChange={(val) => {
          setFilterLocal(val as typeof filter);
          dispatch(filterCalls(val));
        }}
        label={LanguageConstants.SIGN_IN_PAGE.FILTER.LABEL}
      />

      <Box className={styles.tableWrapper}>
        <Box className={styles.tableWrapper}>
          <Table
            headers={headers}
            rows={calls}
            status={status}
            selectedFilter={filter}
            onOpenNotes={openNotes}
            onArchive={askArchive}
            callTypeClassMap={callTypeClassMap}
          />
        </Box>
      </Box>

      {/* Pagination control */}

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
