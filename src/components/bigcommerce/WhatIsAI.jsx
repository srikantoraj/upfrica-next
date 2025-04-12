import React from 'react';

const WhatIsAI = () => {
  return (
    <section id="what-is-ai" className="py-12 px-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">What is AI?</h2>
      <p className="text-lg text-gray-700 mb-4">
        When you think of AI — if you’re a nerd like me — your mind probably turns to Isaac Asimov:
        stories of robots, sentient metal beings, and science-fiction fantasy. But that’s still a few years off.
        Instead, the AI of today instead deals with autonomous learning systems that can perform tasks
        that would otherwise require some sort of human operation.
      </p>
      <p className="text-lg text-gray-700 mb-4">
        There are a variety of practical uses for AI. You’re probably most familiar with generative AI,
        images or text created after a person asked for, say, a picture of a frog playing the trumpet.
        This specific use case is having huge impacts across a variety of industries.
      </p>
      <div className="border-l-4 border-blue-600 pl-4 italic text-gray-800 mb-4">
        “Generative AI is already playing a huge role in tech, and it will only continue to get better and
        more powerful as time goes on,” said <strong>Troy Cox</strong>, Chief Product Officer at <strong>BigCommerce</strong>.
        “Within ecommerce specifically, there are huge possibilities, like search engine optimization,
        language chat services, translations, and image and content creation.”
      </div>
      <blockquote className="bg-gray-100 border-l-4 border-blue-500 p-4 text-gray-800 text-sm">
        “Generative AI is already playing a huge role in tech, and it will only continue to get better and
        more powerful as time goes on. Within ecommerce specifically, there are huge possibilities, like
        search engine optimization, language chat services, translations, and image and content creation."
        <br />
        <span className="block mt-2 font-semibold">- Troy Cox, Chief Product Officer, BigCommerce</span>
      </blockquote>
    </section>
  );
};

export default WhatIsAI;
