// components/home/Questions/QuestionItem.tsx
'use client';

import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full md:w-3/5 mx-auto space-y-2">
      <hr />
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleOpen();
          }
        }}
      >
        <span className="text-base font-bold">{question}</span>
        <span>
          {isOpen ? (
            <IoIosArrowUp className="text-2xl" aria-hidden="true" />
          ) : (
            <IoIosArrowDown className="text-2xl" aria-hidden="true" />
          )}
        </span>
      </div>
      <div
        className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="mt-4 text-base">{answer}</div>
      </div>
    </div>
  );
};

export default FaqItem;
