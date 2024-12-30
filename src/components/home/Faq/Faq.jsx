// components/home/Questions/Questions.tsx
'use client';

import React from 'react';
import FaqItem from './FaqItem';



const FAQ = () => {
  const faqData = [
    {
      question: 'Is there a setup fee or a subscription fee?',
      answer: 'There are no setup fees or a subscription fees. You will only pay a 5% handling fee when your item is sold. No sale No fee.?',
    },
    {
      question: 'How will I know when my item is sold?',
      answer:
        'You will receive an email notification providing the order details so you can process and dispatch the order.',
    },
    {
      question: 'How will I get paid when my item is sold?',
      answer:
        'We will pay to your momo/bank account immediately after the customer has received their item.',
    },
  ];

  return (
    <div className="container py-10 space-y-6 w-full lg:w-1/2  mx-auto px-6">
      <div className="flex justify-center items-center gap-4 font-medium tracking-wide md:text-xl">
        <p>Selling</p>
        <p>Buying</p>
      </div>
      {faqData.map((item, index) => (
        <FaqItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

export default FAQ;
