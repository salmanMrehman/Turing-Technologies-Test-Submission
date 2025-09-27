"use client";

import * as React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store"; // adjust path if different
import { AppBar, Toolbar, Box } from "@mui/material";
import PrimaryButton from "@/components/core/PrimaryButton";
import Image from "next/image";
import styles from "./style.module.scss";
import logo from "../../../../public/images/TT Logo.png";
import { clearAuth, logOut } from "@/redux/features/Auth/authSlice";
import { useRouter, usePathname } from "next/navigation";
import LanguageConstants from "@/constants/languageConstants";

export default function Header() {
const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  // Only show logout on `/calls` or nested calls routes
  const showLogout = pathname?.startsWith("/calls");

  return (
    <AppBar position="sticky" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        {/* left: logo */}
        <Box className={styles.brand}>
          <div className={styles.logoWrap}>
            <Image
              src={logo}
              alt={LanguageConstants.HEADER_COMPONENT.LOGO_ALT}
              priority
              fill
              sizes="160px"
            />
          </div>
        </Box>

        {/* right: logout button (only on /calls) */}
        {showLogout && (
          <Box className={styles.actions}>
            <PrimaryButton
              type="button"
              onClick={async () => {
                await dispatch(logOut()); // server: clear cookie
                dispatch(clearAuth()); // client: reset redux
                router.replace("/login");
              }}
            >
              {LanguageConstants.HEADER_COMPONENT.LOG_OUT}
            </PrimaryButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
