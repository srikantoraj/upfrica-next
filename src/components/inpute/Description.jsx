import { Editor } from '@tinymce/tinymce-react';
import React, { useRef, useEffect } from 'react';

const Description = ({ formik }) => {
  const editorRef = useRef(null);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">*Item description</h2>
      <p className="text-gray-600 mb-4">
        Usually in bullet points{" "}
        <span className="text-red-500">
          Phone numbers or external links are not allowed in the description
        </span>
      </p>
      <hr className="border-gray-300 mb-4" />

      <Editor
        name="description"
        apiKey="wlfjcowajns1o44b16c3vyk0lmxnctw5pehcbmo9070i2f4x"
        value={formik.values.description || ""} // Initial value সঠিকভাবে সেট করুন
        onEditorChange={(content) => {
          console.log(content)
          formik.setFieldValue("description", content); // Update formik field
        }}
        init={{
          height: 200,
          menubar: false,
          plugins: [
            "advlist", "autolink", "lists", "link", "charmap", "preview",
            "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
            "insertdatetime", "media", "table", "help", "wordcount",
          ],
          toolbar:
            "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />

      <p>Add accurate and concise details of your product</p>
    </div>
  );
};

export default Description;
