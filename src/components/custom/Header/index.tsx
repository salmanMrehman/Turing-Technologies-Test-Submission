"use client";

import * as React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import PrimaryButton from "@/components/core/PrimaryButton";
import Image from "next/image";
import styles from "./style.module.scss";
import logo from "../../../../public/images/TT Logo.png";
import { clearAuth } from "@/redux/features/Auth/authSlice";
import { useRouter } from "next/navigation";
import LanguageConstants from "@/constants/languageConstants";

export default function Header() {
  const router = useRouter();

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

        {/* right: button */}
        <Box className={styles.actions}>
          <PrimaryButton
            type="button"
            onClick={() => {
              clearAuth();
              router.push("/login");
            }}
            disabled={false}
          >
            {LanguageConstants.HEADER_COMPONENT.LOG_OUT}
          </PrimaryButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
