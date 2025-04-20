import React from "react";

const ApprovalNotesSelect = ({ formik }) => {
  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="p-4">
        <div className="grid grid-cols-1  gap-4">
          <div>
            <label htmlFor="approval_notes" className="blocktext-lg font-semibold mb-2">
            Approval notes
            </label>
            <select
              name="approval_notes"
              id="approval_notes"
              value={formik.values.approval_notes}
              onChange={formik.handleChange}
              className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200"
            >
              <option value="">Select</option>
              <option value="Phone number or contact details not allowed on images">
                Phone number or contact details not allowed on images
              </option>
              <option value="Please remove text from the main image">
                Please remove text from the main image
              </option>
              <option value="Please upload a clearer image">Please upload a clearer image</option>
              <option value="Provide a valid contact number. Go to your Profile Settings">
                Provide a valid contact number. Go to your Profile Settings
              </option>
              <option value="Description should be in bullet points, include keywords">
                Description should be in bullet points, include keywords
              </option>
              <option value="The first 2-3 words in the title must contain main keywords">
                The first 2-3 words in the title must contain main keywords
              </option>
              <option value="Missing Supplier Link">Missing Supplier Link</option>
              <option value="Missing Supplier phone number">Missing Supplier phone number</option>
              <option value="Missing Supplier name">Missing Supplier name</option>
              <option value="Missing images">Missing images</option>
              <option value="Duplicate listing">Duplicate listing</option>
              <option value="Supplier MOQ too high">Supplier MOQ too high</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalNotesSelect;
