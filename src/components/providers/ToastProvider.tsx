"use client";

import React from "react";
import { Toaster } from "react-hot-toast";
import { colors } from "@/styles/design-tokens";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={16}
        toastOptions={{
          duration: 4000,
          style: {
            background: colors.bgCard,
            color: colors.textPrimary,
            border: `1px solid ${colors.borderDark}`,
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "Inter, system-ui, sans-serif",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
    </>
  );
};
