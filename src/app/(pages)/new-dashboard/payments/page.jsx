import React from "react";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from "react-icons/fa";

export default function Page() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <p style={styles.message}>🚧 No payment system implemented yet</p>
        <div style={styles.iconRow}>
          <FaCcVisa size={48} style={styles.icon} />
          <FaCcMastercard size={48} style={styles.icon} />
          <FaCcAmex size={48} style={styles.icon} />
          <FaCcPaypal size={48} style={styles.icon} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh", // full viewport height
    display: "flex",
    justifyContent: "center", // horizontal center
    alignItems: "center", // vertical center
    backgroundColor: "#f5f5f5",
  },
  content: {
    textAlign: "center",
  },
  message: {
    marginBottom: "1rem",
    fontSize: "1.25rem",
    color: "#333",
  },
  iconRow: {
    display: "flex",
    gap: "1.5rem",
    justifyContent: "center",
  },
  icon: {
    color: "#bbb", // light gray to show “disabled” state
  },
};
