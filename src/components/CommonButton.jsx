import React from 'react';

const CommonButton = ({ text, className,}) => {
    return (
        <button className={className}>
            {text}
        </button>
    );
};

export default CommonButton;