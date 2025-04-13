import React from 'react';

const AiBlogHeader = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-left text-gray-900 leading-tight">
        AI Is Reshaping How Fashion Brands Do Business Online
      </h1>

      <a
        href="https://www.bigcommerce.com/blog/author/reed-hartman/"
        className="text-blue-600 hover:underline"
      >
        Reed Hartman
      </a>

      <img
        src="https://images.ctfassets.net/wowgx05xsdrr/WowDjiP6bGhiSInKMNgGB/0acce55c9a00bbf3c66fa3e5061211cf/blog-header-2.png?fm=webp&amp;w=3840&amp;q=75"
        alt="Fashion Series - AI Blog"
        className="w-full h-auto rounded-md object-cover"
      />

      <div className="flex flex-wrap gap-3">
        <a
          href="https://www.bigcommerce.com/blog/category/fashion-apparel/"
          className="inline-block border border-gray-900 text-gray-400 rounded-md py-1 px-3 text-sm hover:bg-gray-200 transition-colors"
        >
          Fashion & Apparel
        </a>
        <a
          href="https://www.bigcommerce.com/blog/category/ecommerce-news-insights/"
          className="inline-block border border-gray-900 text-gray-400 rounded-md py-1 px-3 text-sm hover:bg-gray-200 transition-colors"
        >
          Ecommerce News & Insights
        </a>
      </div>
    </div>
  );
};

export default AiBlogHeader;
