import React from 'react';
import InputField from '../InuteFiled';

const Title = ({formik}) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-2">Your Title Here</h2>

            <p className="text-gray-600 mb-4">
                This is your paragraph text here.
            </p>

            <hr className="border-gray-300 mb-4" />

            <InputField
                id="title"
                name="title"
                type="text"
                value={formik?.values?.title}
                onChange={formik?.handleChange}
                placeholder="Type something here..."
            />
            <p className="text-gray-500 mt-2">
                {formik?.values?.title?.length} / 80
            </p>
        </div>
    );
};

export default Title;