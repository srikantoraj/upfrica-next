


// import React, { useState } from "react";
// import ImageUploading from "react-images-uploading";
// import { IoMdPhotos } from "react-icons/io";

// const Photo = ({ onImagesSelect }) => {
//     const [images, setImages] = useState([]);
//     const maxNumber = 69;

//     const onChange = (imageList) => {
//         setImages(imageList);
//         // Lift the selected images to the parent component
//         if (onImagesSelect) {
//             onImagesSelect(imageList);
//         }
//     };

//     return (
//         <div>
//             <div className="space-y-2 py-4">
//                 <h1 className="text-2xl font-bold">*Photos & Video</h1>
//                 <p>Phone numbers are not allowed on photos</p>
//             </div>
//             <hr />
//             <div className="space-y-4 m-4">
//                 <p>Supported files: *.jpg and *.png</p>
//                 <ImageUploading
//                     multiple
//                     value={images}
//                     onChange={onChange}
//                     maxNumber={maxNumber}
//                     dataURLKey="data_url"
//                 >
//                     {({ imageList, onImageUpload, onImageRemove }) => (
//                         <div className="upload__image-wrapper">
//                             <button type="button" className="h-40 w-40 border" onClick={onImageUpload}>
//                                 <IoMdPhotos className="h-8 w-8 mx-auto" />
//                                 Add Photos
//                             </button>
//                             {imageList.map((image, index) => (
//                                 <div key={index} className="image-item">
//                                     <img src={image.data_url} alt="" width="100" />
//                                     <button type="button" onClick={() => onImageRemove(index)}>
//                                         Remove
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </ImageUploading>
//             </div>
//             <hr />
//             {/* You can add additional logic for video upload, pricing, or approval notes here */}
//         </div>
//     );
// };

// export default Photo;

import React, { useState, useEffect } from "react";
import ImageUploading from "react-images-uploading";
import { IoMdPhotos } from "react-icons/io";

const Photo = ({ initialImages = [], onImagesSelect }) => {
    // Convert URL strings into { data_url } objects for the uploader
    const [images, setImages] = useState(
        initialImages.map((url) => ({ data_url: url }))
    );
    const maxNumber = 69;

    // If the parent hands us a new initialImages array, re‑initialize
    useEffect(() => {
        if (initialImages.length > 0) {
            setImages(initialImages.map((url) => ({ data_url: url })));
        }
    }, [initialImages]);


    const onChange = (imageList) => {
        console.log("Selected image list:", imageList); // 👈 eta add koro
        setImages(imageList);
        if (onImagesSelect) {
            onImagesSelect(imageList);
        }
    };


    return (
        <div>
            <div className="space-y-2 py-4">
                <h1 className="text-2xl font-bold">*Photos & Video</h1>
                <p>Phone numbers are not allowed on photos</p>
            </div>
            <hr />
            <div className="space-y-4 m-4">
                <p>Supported files: *.jpg and *.png</p>
                <ImageUploading
                    multiple
                    value={images}
                    onChange={onChange}
                    maxNumber={maxNumber}
                    dataURLKey="data_url"
                >
                    {({
                        imageList,
                        onImageUpload,
                        onImageRemove,
                        isDragging,
                        dragProps,
                    }) => (
                        <div className="upload__image-wrapper">
                            <button
                                type="button"
                                className={`h-40 w-40 border flex items-center justify-center ${isDragging ? "bg-gray-200" : ""
                                    }`}
                                style={{ cursor: "pointer" }}
                                onClick={onImageUpload}
                                {...dragProps}
                            >
                                <IoMdPhotos className="h-8 w-8" />
                                <span className="ml-2">Add Photos</span>
                            </button>

                            <div className="flex flex-wrap gap-4 mt-4">
                                {imageList.map((image, index) => {
                                    console.log("Rendering image:", image); // 👈 eta add koro
                                    return (
                                        <div key={index} className="relative">
                                            <img
                                                src={image?.data_url}
                                                alt={`upload-${index}`}
                                                className="h-24 w-24 object-cover rounded-md border" // border for debug
                                            />
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    )}
                </ImageUploading>
            </div>
            <hr />
        </div>
    );
};

export default Photo;
