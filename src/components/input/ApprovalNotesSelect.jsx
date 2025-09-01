// import React from "react";

// const ApprovalNotesSelect = ({ formik }) => {
//   return (
//     <div className="bg-white shadow rounded-lg mb-6">
//       <div className="p-4">
//         <div className="grid grid-cols-1  gap-4">
//           <div>
//             <label htmlFor="approval_notes" className="blocktext-lg font-semibold mb-2">
//             Approval notes
//             </label>
//             <select
//               name="approval_notes"
//               id="approval_notes"
//               value={formik.values.approval_notes}
//               onChange={formik.handleChange}
//               className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200"
//             >
//               <option value="">Select</option>
//               <option value="Phone number or contact details not allowed on images">
//                 Phone number or contact details not allowed on images
//               </option>
//               <option value="Please remove text from the main image">
//                 Please remove text from the main image
//               </option>
//               <option value="Please upload a clearer image">Please upload a clearer image</option>
//               <option value="Provide a valid contact number. Go to your Profile Settings">
//                 Provide a valid contact number. Go to your Profile Settings
//               </option>
//               <option value="Description should be in bullet points, include keywords">
//                 Description should be in bullet points, include keywords
//               </option>
//               <option value="The first 2-3 words in the title must contain main keywords">
//                 The first 2-3 words in the title must contain main keywords
//               </option>
//               <option value="Missing Supplier Link">Missing Supplier Link</option>
//               <option value="Missing Supplier phone number">Missing Supplier phone number</option>
//               <option value="Missing Supplier name">Missing Supplier name</option>
//               <option value="Missing images">Missing images</option>
//               <option value="Duplicate listing">Duplicate listing</option>
//               <option value="Supplier MOQ too high">Supplier MOQ too high</option>
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApprovalNotesSelect;

import React from "react";

const ApprovalNotesSelect = ({ formik }) => {
  // your preset options
  const OPTIONS = [
    { value: "", label: "Select" },
    {
      value: "Phone number or contact details not allowed on images",
      label: "Phone number or contact details not allowed on images",
    },
    {
      value: "Please remove text from the main image",
      label: "Please remove text from the main image",
    },
    {
      value: "Please upload a clearer image",
      label: "Please upload a clearer image",
    },
    {
      value: "Provide a valid contact number. Go to your Profile Settings",
      label: "Provide a valid contact number. Go to your Profile Settings",
    },
    {
      value: "Description should be in bullet points, include keywords",
      label: "Description should be in bullet points, include keywords",
    },
    {
      value: "The first 2-3 words in the title must contain main keywords",
      label: "The first 2-3 words in the title must contain main keywords",
    },
    { value: "Missing Supplier Link", label: "Missing Supplier Link" },
    {
      value: "Missing Supplier phone number",
      label: "Missing Supplier phone number",
    },
    { value: "Missing Supplier name", label: "Missing Supplier name" },
    { value: "Missing images", label: "Missing images" },
    { value: "Duplicate listing", label: "Duplicate listing" },
    { value: "Supplier MOQ too high", label: "Supplier MOQ too high" },
    // the “Other” hook:
    { value: "Other", label: "Other (write your own…)" },
  ];

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="p-4 space-y-4">
        {/* dropdown */}
        <div>
          <label
            htmlFor="approval_notes"
            className="block text-lg font-semibold mb-2"
          >
            Approval notes
          </label>
          <select
            id="approval_notes"
            name="approval_notes"
            value={formik.values.approval_notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200"
          >
            {OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {formik.touched.approval_notes && formik.errors.approval_notes ? (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.approval_notes}
            </p>
          ) : null}
        </div>

        {/* custom‐text area, only if “Other” chosen */}
        {formik.values.approval_notes === "Other" && (
          <div>
            <label
              htmlFor="approval_notes_custom"
              className="block text-lg font-semibold mb-2"
            >
              Your custom approval note
            </label>
            <textarea
              id="approval_notes_custom"
              name="approval_notes_custom"
              value={formik.values.approval_notes_custom}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Type your note here…"
              className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200 resize-y"
              rows={4}
            />
            {formik.touched.approval_notes_custom &&
            formik.errors.approval_notes_custom ? (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.approval_notes_custom}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalNotesSelect;
