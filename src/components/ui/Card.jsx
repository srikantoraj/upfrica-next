import React from "react";
import classNames from "classnames";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={classNames(
        "rounded-2xl border border-gray-200 bg-white shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={classNames("p-4", className)} {...props}>
      {children}
    </div>
  );
}
