import React from "react";

const CategoreTitle = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  onClick,
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onClick={onClick}
      onChange={onChange}
      className="w-full px-3 rounded-lg  border-none   focus:outline-none  focus:ring-0"
      placeholder={placeholder}
    />
  );
};

export default CategoreTitle;
