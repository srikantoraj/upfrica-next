import React from "react";

const PdfDownloadCard = () => {
  return (
    <div className="flex flex-col md:flex-row gap-12 p-8 bg-gray-100">
      <div className="hidden md:block w-36 shrink-0">
        <div className="flex flex-col shadow-md bg-white">
          <img
            src="https://images.ctfassets.net/wowgx05xsdrr/WowDjiP6bGhiSInKMNgGB/0acce55c9a00bbf3c66fa3e5061211cf/blog-header-2.png"
            alt="Blog Header"
            className="aspect-video object-cover h-10"
          />
          <p className="text-[10px] text-gray-400 text-center p-2.5">
            AI Is Reshaping Fashion
          </p>
          <div className="grow px-6 pb-3 space-y-1">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-[3px] rounded bg-gray-300"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <p className="text-lg font-bold">Get The Print Version</p>
          <p className="text-gray-600">
            Tired of scrolling? Download a PDF version for easier offline
            reading.
          </p>
        </div>
        <button className="bg-blue-600 text-white uppercase text-xs px-6 py-2 rounded hover:bg-blue-700 transition">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PdfDownloadCard;
