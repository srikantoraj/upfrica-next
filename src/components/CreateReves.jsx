// import React from 'react';

// const CreateReves = () => {
//     return (
//         <section className="mt-12">
//             <h3 className="text-lg md:text-xl lg:text-2xl font-medium border-b pb-3">
//                 Write a Review
//             </h3>
//             <form className="mt-6 space-y-6">
//                 {/* Hidden Inputs */}
//                 <input type="hidden" name="authenticity_token" value="..." />
//                 <input type="hidden" name="review[reviewer_id]" value="1" />
//                 <input type="hidden" name="review[product_id]" value="155" />

//                 {/* Rating */}
//                 <div>
//                     <label className="block text-[#A435F0] mb-1  text-sm md:text-base lg:text-lg">
//                         Select stars for your rating. The higher the better
//                     </label>
//                     <select
//                         className="w-full border rounded p-2 text-sm md:text-base"
//                         name="review[rating]"
//                         id="review_rating"
//                     >
//                         <option value="5">★★★★★ (5/5)</option>
//                         <option value="4">★★★★☆ (4/5)</option>
//                         <option value="3">★★★☆☆ (3/5)</option>
//                         <option value="2">★★☆☆☆ (2/5)</option>
//                         <option value="1">★☆☆☆☆ (1/5)</option>
//                     </select>
//                 </div>

//                 {/* Headline */}
//                 <div>
//                     <label className="block text-[#A435F0]  mb-1  text-sm md:text-base lg:text-lg">
//                         Headline
//                     </label>
//                     <input
//                         className="w-full border rounded p-2 text-sm md:text-base"
//                         placeholder="Sum it up in a few words"
//                         type="text"
//                         name="review[title]"
//                     />
//                 </div>

//                 {/* Comment */}
//                 <div>
//                     <label className="block mb-1 font-semibold text-sm md:text-base lg:text-lg">
//                         Review
//                     </label>
//                     <textarea
//                         className="w-full border rounded p-2 text-sm md:text-base"
//                         rows={5}
//                         placeholder="Write a review and share details of your own experience"
//                         name="review[comment]"
//                     ></textarea>
//                 </div>

//                 {/* Submit */}
//                 <button
//                     type="submit"
//                     className="bg-[#A435F0] text-white px-4 lg:px-8 py-2 lg:py-3 rounded font-semibold text-sm md:text-base"
//                 >
//                     Post review
//                 </button>
//             </form>
//         </section>
//     );
// };

// export default CreateReves;



// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";

// const CreateReves = () => {
//   const initialValues = {
//     rating: "",
//     title: "",
//     comment: "",
//   };

//   const validate = (values) => {
//     const errors = {};
//     if (!values.rating) errors.rating = "Rating is required";
//     if (!values.title) errors.title = "Title is required";
//     if (!values.comment) errors.comment = "Review comment is required";
//     return errors;
//   };

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       const response = await fetch(
//         "https://media.upfrica.com/api/products/redmi-power-bank-18w-fast-power-charger/reviews/",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             title: values.title,
//             rating: parseInt(values.rating),
//             comment: values.comment,
//             reviewer: 1, // Replace with dynamic user ID if needed
//             product: 155, // Replace with dynamic product ID
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to post review");
//       }

//       alert("Review submitted successfully!");
//       resetForm();
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong. Try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <section className="mt-12">
//       <h3 className="text-lg md:text-xl lg:text-2xl font-medium border-b pb-3">
//         Write a Review
//       </h3>

//       <Formik
//         initialValues={initialValues}
//         validate={validate}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting }) => (
//           <Form className="mt-6 space-y-6">
//             {/* Rating */}
//             <div>
//               <label className="block text-[#A435F0] mb-1 text-sm md:text-base lg:text-lg">
//                 Select stars for your rating. The higher the better
//               </label>
//               <Field
//                 as="select"
//                 name="rating"
//                 className="w-full border rounded p-2 text-sm md:text-base"
//               >
//                 <option value="">Select rating</option>
//                 <option value="5">★★★★★ (5/5)</option>
//                 <option value="4">★★★★☆ (4/5)</option>
//                 <option value="3">★★★☆☆ (3/5)</option>
//                 <option value="2">★★☆☆☆ (2/5)</option>
//                 <option value="1">★☆☆☆☆ (1/5)</option>
//               </Field>
//               <ErrorMessage
//                 name="rating"
//                 component="div"
//                 className="text-red-500 text-sm mt-1"
//               />
//             </div>

//             {/* Title */}
//             <div>
//               <label className="block text-[#A435F0] mb-1 text-sm md:text-base lg:text-lg">
//                 Headline
//               </label>
//               <Field
//                 type="text"
//                 name="title"
//                 placeholder="Sum it up in a few words"
//                 className="w-full border rounded p-2 text-sm md:text-base"
//               />
//               <ErrorMessage
//                 name="title"
//                 component="div"
//                 className="text-red-500 text-sm mt-1"
//               />
//             </div>

//             {/* Comment */}
//             <div>
//               <label className="block mb-1 font-semibold text-sm md:text-base lg:text-lg">
//                 Review
//               </label>
//               <Field
//                 as="textarea"
//                 name="comment"
//                 rows="5"
//                 placeholder="Write a review and share details of your own experience"
//                 className="w-full border rounded p-2 text-sm md:text-base"
//               />
//               <ErrorMessage
//                 name="comment"
//                 component="div"
//                 className="text-red-500 text-sm mt-1"
//               />
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-[#A435F0] text-white px-4 lg:px-8 py-2 lg:py-3 rounded font-semibold text-sm md:text-base"
//             >
//               {isSubmitting ? "Posting..." : "Post review"}
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </section>
//   );
// };

// export default CreateReves;


import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

const CreateReves = () => {
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

    try {
      const response = await fetch(
        "https://media.upfrica.com/api/products/redmi-power-bank-18w-fast-power-charger/reviews/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
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

