const Checkbox = ({ label, id }) => (
    <div className="flex w-full mb-4">
      <label
        className="text-[#747579] w-2/6 text-left pr-4 text-base font-bold"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className="border border-gray-300 rounded focus:outline-none"
        type="checkbox"
        id={id}
      />
    </div>
  );

  export default Checkbox;