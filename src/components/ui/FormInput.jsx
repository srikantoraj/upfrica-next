const FormInput = ({ label, type, id, placeholder }) => (
    <div className="flex w-full mb-4">
      <label
        className="text-[#747579] md:w-3/6 text-left pr-4 text-base font-bold"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className="w-3/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
        type={type}
        id={id}
        placeholder={placeholder}
      />
    </div>
  );
  

  


  export default FormInput;