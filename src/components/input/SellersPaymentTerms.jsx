import { Editor } from "@tinymce/tinymce-react";
import React, { useRef } from "react";

const SellersPaymentTerms = ({ formik }) => {
  const editorRef = useRef(null);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">*Seller’s Payment Terms</h2>
      <p className="text-gray-600 mb-4">
        Outline your payment terms (e.g. “50% upfront, 50% on delivery”).
      </p>
      <hr className="border-gray-300 mb-4" />

      <Editor
        name="seller_payment_terms"
        apiKey="cly2l2971z9pgqhfjufgnqbl1h4nomfzmiqbjositk620gut"
        value={formik.values.seller_payment_terms || ""}
        onEditorChange={(content) =>
          formik.setFieldValue("seller_payment_terms", content)
        }
        init={{
          height: 300,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />

      <p className="mt-2 text-sm text-gray-500">
        Be as clear as possible—this will show up on your listing page.
      </p>
    </div>
  );
};

export default SellersPaymentTerms;
