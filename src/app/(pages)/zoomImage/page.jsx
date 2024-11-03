"use client";
import React from 'react';
import ReactImageMagnify from 'react-image-magnify';

const Page = () => {
    return (
        <div className='overflow-auto'>
            <ReactImageMagnify {...{
                smallImage: {
                    alt: 'Product Image',
                    isFluidWidth: false,
                    width: 600,  // Original image width
                    height: 600, // Original image height
                    src: "https://static.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg"
                },
                largeImage: {
                    src: "https://static.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg",
                    width: 1800, // Larger image width for more detailed zoom
                    height: 1800 // Larger image height for more detailed zoom
                },
                enlargedImageContainerDimensions: {
                    width: '150%', // Adjust as needed for a larger zoomed-in view
                    height: '150%' // Adjust as needed for a larger zoomed-in view
                },
                isHintEnabled: true, // Optional: shows a hint for zoom
            }} />
        </div>
    );
};

export default Page;
