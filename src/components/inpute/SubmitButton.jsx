import React from 'react';

const SubmitButton = () => {
    return (
        <div className="flex justify-between text-xl font-bold p-4">
            <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded-md"
            >
                Save and continue
            </button>
            <button>Cancel</button>
        </div>
    );
};

export default SubmitButton;