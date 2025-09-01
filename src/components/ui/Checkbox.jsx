const Checkbox = ({ label, id }) => (
  <div className=" w-full mb-4 grid grid-cols-3 md:grid-cols-5">
    <label
      className="text-[#747579]   pr-4 text-base font-bold col-span-1 md:col-span-1 text-right"
      htmlFor={id}
    >
      {label}
    </label>
    <input
      className="border border-gray-300 rounded focus:outline-none col-span-1 h-4 md:col-span-1"
      type="checkbox"
      id={id}
    />
  </div>
);

export default Checkbox;
