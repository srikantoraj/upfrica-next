import React from "react";
import TableOfContents from "./TableOfContents";
import ShareButtons from "./ShareButtons";
import BlogHeader from "./BlogHeader";
import PdfDownloadCard from "./PdfDownloadCard";
import AuthorCard from "./AuthorCard";
import WhatIsAI from "./WhatIsAI";
import AIMachineTypes from "./AIMachineTypes";
import FashionAIImpact from "./FashionAIImpact";

// import BlogContent from "./components/BlogContent";

const BlogPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
      <aside className="md:col-span-1 space-y-8">
        <TableOfContents />
        {/* <ShareButtons /> */}
      </aside>
      <main className="md:col-span-3 space-y-10">
        <BlogHeader />
        <PdfDownloadCard />
        {/* <BlogContent /> */}
        <WhatIsAI />
        <AIMachineTypes />
        <FashionAIImpact />
        <AuthorCard />
      </main>
    </div>
  );
};

export default BlogPage;
