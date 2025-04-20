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
      className="w-full px-3 rounded-l-lg  border-none  focus:ring-0"
      placeholder={placeholder}
    />
  );
};

export default InputField;
