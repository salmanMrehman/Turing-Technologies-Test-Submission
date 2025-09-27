const CONSTANTS = {
    SIGN_IN_PAGE: {
        PAGE_TITLE: "Turing Technologies Frontend Test",

        FILTER: {
            LABEL: "Filter by:",
            ALL: "All",
            ARCHIVED: "Archived",
            UNARCHIVED: "Unarchived",
            MISSED: "Missed",
            ANSWERED: "Answered",
            VOICE_MAIL: "Voice Mail",
        },

        FILTER_VALUES: {
            ALL: "all",
            ARCHIVED: "archived",
            UNARCHIVED: "unarchived",
            MISSED: "missed",
            ANSWERED: "answered",
            VOICE_MAIL: "voice mail",
        },

        TABLE: {
            CALL_TYPE: "Call Type",
            DIRECTION: "Direction",
            DURATION: "Duration",
            FROM: "From",
            TO: "To",
            VIA: "Via",
            CREATED_AT: "Created At",
            STATUS: "Status",
            ACTIONS: "Actions",
            LOADING: "Loading…",
        },

        TABLE_HEADER_KEY: {
            CALL_TYPE: "call_type",
            DIRECTION: "direction",
            DURATION: "duration",
            FROM: "from",
            TO: "to",
            VIA: "via",
            CREATED_AT: "created_at",
            STATUS: "status",
            ACTIONS: "actions",
        },

        DIRECTION: {
            INBOUND: "Inbound",
            OUTBOUND: "Outbound",
        },

        ACTIONS: {
            ADD_NOTE: "Add Note",
        },

        CONFIRM_DIALOG: {
            TITLE: "Confirm",
            MESSAGE: "Do you want to toggle archive state for this call?",
            CONFIRM_TEXT: "Yes, proceed",
            CANCEL: 'Cancel',
        },

        RESULTS: (start: number, end: number, total: number) =>
            `${start} – ${end} of ${total} results`,
    },
    SIGNIN_PAGE: {
    USERNAME_LABEL: "User Name",
    USERNAME_PLACEHOLDER: "Email",

    PASSWORD_LABEL: "Password",
    PASSWORD_PLACEHOLDER: "Password",

    ERRORS: {
      EMAIL_REQUIRED: "Email is required",
      EMAIL_INVALID: "Enter a valid email",
      PASSWORD_REQUIRED: "Password is required",
      PASSWORD_MIN: "Minimum 6 characters",
    },

    BUTTON: {
      LOGIN: "Log in",
      LOGGING_IN: "Logging in…",
    },

    TOAST: {
      LOGIN_FAILED: "Login Failed",
    },
    },
    ADD_NOTES_COMPONENT: {
    TITLE: "Add Notes",
    CALL_ID: (id: string) => `Call ID: ${id}`,

    LABELS: {
      CALL_TYPE: "Call Type",
      DURATION: "Duration",
      FROM: "From",
      TO: "To",
      VIA: "Via",
      NOTES_EXISTING: "Notes",
      NOTES_NEW: "Add a new note",
    },

    PLACEHOLDERS: {
      ADD_NOTE: "Add Notes",
    },

    ERRORS: {
      EMPTY_NOTE: "Please enter a note.",
    },

    NOTES: {
      EMPTY: "No notes yet.",
      ARIA_LABEL: "Existing notes",
    },

    BUTTONS: {
      SAVE: "Save",
    },
  },
  HEADER_COMPONENT: {
    LOGO_ALT: 'Turing Technologies',
    LOG_OUT: 'Log Out'
  }
};

export default CONSTANTS;
