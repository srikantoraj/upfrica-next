import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

const CreateReves = ({ slug }) => {
  const initialValues = {
    title: "",
    rating: "",
    comment: "",
    quality: "",
    value: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.title) errors.title = "Title is required";
    if (!values.rating) errors.rating = "Rating is required";
    if (!values.comment) errors.comment = "Comment is required";
    if (!values.quality) errors.quality = "Quality answer is required";
    if (!values.value) errors.value = "Value answer is required";
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
      title: values.title,
      rating: parseInt(values.rating),
      comment: values.comment,
      questions: {
        quality: values.quality,
        value: values.value,
      },
    };

    // Token localStorage থেকে নেওয়া
    const token = localStorage.getItem("token");
    console.log("token", token);

    try {
      const response = await fetch(
        `https://api.upfrica.com/api/products/${slug}/reviews/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to post review");
      }

      alert("Review submitted successfully!");
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12">
      <h3 className="text-lg md:text-xl lg:text-2xl font-medium border-b pb-3">
        Write a Review
      </h3>

      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="mt-6 space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-[#A435F0] mb-1 text-sm lg:text-lg">
                Rating
              </label>
              <Field
                as="select"
                name="rating"
                className="w-full border rounded p-2"
              >
                <option value="">Select rating</option>
                <option value="5">★★★★★ (5/5)</option>
                <option value="4">★★★★☆ (4/5)</option>
                <option value="3">★★★☆☆ (3/5)</option>
                <option value="2">★★☆☆☆ (2/5)</option>
                <option value="1">★☆☆☆☆ (1/5)</option>
              </Field>
              <ErrorMessage
                name="rating"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-[#A435F0] mb-1 text-sm lg:text-lg">
                Headline
              </label>
              <Field
                type="text"
                name="title"
                placeholder="Give your review a title"
                className="w-full border rounded p-2"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block font-semibold mb-1 text-sm lg:text-lg">
                Review
              </label>
              <Field
                as="textarea"
                name="comment"
                rows="5"
                placeholder="Describe your experience"
                className="w-full border rounded p-2"
              />
              <ErrorMessage
                name="comment"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Quality Question */}
            <div>
              <label className="block mb-1 text-sm lg:text-lg font-medium">
                How was the quality?
              </label>
              <Field
                as="select"
                name="quality"
                className="w-full border rounded p-2"
              >
                <option value="">Select quality</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Field>
              <ErrorMessage
                name="quality"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Value Question */}
            <div>
              <label className="block mb-1 text-sm lg:text-lg font-medium">
                Was it worth the value?
              </label>
              <Field
                as="select"
                name="value"
                className="w-full border rounded p-2"
              >
                <option value="">Select value</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </Field>
              <ErrorMessage
                name="value"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#A435F0] text-white px-6 py-2 rounded font-semibold"
            >
              {isSubmitting ? "Posting..." : "Post Review"}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default CreateReves;
