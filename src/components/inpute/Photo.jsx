// import React, { useState } from 'react';
// import ImageUploading from 'react-images-uploading';
// import { IoMdPhotos } from 'react-icons/io'; 

// const Photo = () => {
//     const [images, setImages] = useState([]);
//     const [files, setFiles] = useState([]);
//     const [result, setResult] = useState(null);
//     const maxNumber = 69;

//     const onChange = async (imageList) => {
//         setImages(imageList);
//         // Uncomment the line below if needed
//         // const base64Images = await convertImageListToBase64(imageList);
//         // formik.setFieldValue("product_image", base64Images);
//     };

//     const onFilesChange = (imageList) => {
//         setFiles(imageList);
//         // formik.setFieldValue("product_files", imageList);
//     };

//     const convertImageListToBase64 = (imageFiles) => {
//         return Promise.all(
//             imageFiles.map((imageFile) => {
//                 return new Promise((resolve, reject) => {
//                     const reader = new FileReader();
//                     reader.readAsDataURL(imageFile.file); // Access file object
//                     reader.onload = () => resolve(reader.result);
//                     reader.onerror = (error) => reject(error);
//                 });
//             })
//         );
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
//                                     <button onClick={() => onImageRemove(index)}>Remove</button>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </ImageUploading>
//             </div>
//             <hr />
//             {/* Remaining code for video upload, pricing, and approval notes */}
//         </div>
//     );
// };

// export default Photo;


import React, { useState } from "react";
import ImageUploading from "react-images-uploading";
import { IoMdPhotos } from "react-icons/io";

const Photo = ({ onImagesSelect }) => {
    const [images, setImages] = useState([]);
    const maxNumber = 69;

    const onChange = (imageList) => {
        setImages(imageList);
        // Lift the selected images to the parent component
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
                    {({ imageList, onImageUpload, onImageRemove }) => (
                        <div className="upload__image-wrapper">
                            <button type="button" className="h-40 w-40 border" onClick={onImageUpload}>
                                <IoMdPhotos className="h-8 w-8 mx-auto" />
                                Add Photos
                            </button>
                            {imageList.map((image, index) => (
                                <div key={index} className="image-item">
                                    <img src={image.data_url} alt="" width="100" />
                                    <button type="button" onClick={() => onImageRemove(index)}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </ImageUploading>
            </div>
            <hr />
            {/* You can add additional logic for video upload, pricing, or approval notes here */}
        </div>
    );
};

export default Photo;

