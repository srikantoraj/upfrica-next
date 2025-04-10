// InputField.js
import React from "react";

const InputField = ({ id, name, type, value, onChange, placeholder,onClick }) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onClick={onClick}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      placeholder={placeholder}
    />
  );
};

export default InputField;
