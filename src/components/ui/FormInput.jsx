const FormInput = ({ label, type, id, placeholder }) => (
    <div className="grid grid-cols-3 md:grid-cols-5">
      <label
        className="text-[#747579]  pr-4 text-base font-bold col-span-1 md:col-span-1 text-right"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className=" p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base col-span-2 md:col-span-3"
        type={type}
        id={id}
        placeholder={placeholder}
      />
    </div>
  );
  

  


  export default FormInput;