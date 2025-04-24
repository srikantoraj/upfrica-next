// import React, { useState, useEffect, useRef } from "react";
// import ImageUploading from "react-images-uploading";
// import { IoMdPhotos } from "react-icons/io";

// const Photo = ({ initialImages = [], onImagesSelect }) => {
//     const MAX_IMAGES = 12;

//     // State: array of { data_url } objects
//     const [images, setImages] = useState(
//         initialImages.map((url) => ({ data_url: url }))
//     );

//     // Refs for HTML5 drag-and-drop reordering
//     const dragItem = useRef(null);
//     const dragOverItem = useRef(null);

//     // Sync when parent updates initialImages
//     useEffect(() => {
//         if (initialImages.length) {
//             setImages(initialImages.map((url) => ({ data_url: url })));
//         }
//     }, [initialImages]);

//     // Called by ImageUploading on add/remove
//     const handleChange = (imageList) => {
//         setImages(imageList);
//         onImagesSelect?.(imageList);
//     };

//     // After drag ends, reorder and notify parent
//     const handleDragEnd = () => {
//         if (dragItem.current == null || dragOverItem.current == null) return;
//         const list = Array.from(images);
//         const [moved] = list.splice(dragItem.current, 1);
//         list.splice(dragOverItem.current, 0, moved);
//         dragItem.current = dragOverItem.current = null;
//         setImages(list);
//         onImagesSelect?.(list);
//     };

//     return (
//         <div>
//             {/* Counter */}
//             <p className="text-sm text-gray-500 mb-2">
//                 {images.length}/{MAX_IMAGES}
//             </p>

//             <ImageUploading
//                 multiple
//                 value={images}
//                 onChange={handleChange}
//                 maxNumber={MAX_IMAGES}
//                 dataURLKey="data_url"
//             >
//                 {({
//                     imageList,
//                     onImageUpload,
//                     onImageRemove,
//                     isDragging,
//                     dragProps,
//                 }) => {
//                     const smallCount = MAX_IMAGES - 1;
//                     const uploadedSmall = Math.max(imageList.length - 1, 0);
//                     const showSmallUpload =
//                         imageList.length >= 1 && imageList.length < MAX_IMAGES;
//                     const placeholders =
//                         smallCount - uploadedSmall - (showSmallUpload ? 1 : 0);

//                     // Shared classes
//                     const largeDZ = `
//             border-2 border-dashed border-gray-300
//             rounded-lg flex flex-col items-center justify-center
//             text-center p-6 cursor-pointer
//             w-full h-[200px]
//           `;
//                     const smallDZ = `
//             border-2 border-dashed border-gray-300
//             rounded-lg flex flex-col items-center justify-center
//             text-center p-4 cursor-pointer
//             w-full h-[100px]
//           `;

//                     return (
//                         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//                             {/* ── Large slot (index 0) ── */}
//                             <div className="md:col-span-2">
//                                 {imageList.length === 0 ? (
//                                     <div
//                                         className={`${largeDZ} ${isDragging ? "bg-gray-100" : ""
//                                             }`}
//                                         onClick={onImageUpload}
//                                         {...dragProps}
//                                     >
//                                         <IoMdPhotos className="w-8 h-8 text-gray-500 mb-2" />
//                                         <p className="font-medium text-sm">Drag &amp; Drop</p>
//                                         <span className="mt-2 px-4 py-1 border rounded-full text-sm text-gray-700">
//                                             Upload
//                                         </span>
//                                     </div>
//                                 ) : (
//                                     <div
//                                         draggable
//                                         onDragStart={() => (dragItem.current = 0)}
//                                         onDragEnter={() => (dragOverItem.current = 0)}
//                                         onDragOver={(e) => e.preventDefault()}
//                                         onDragEnd={handleDragEnd}
//                                         className="relative rounded-lg overflow-hidden bg-white w-full h-[200px] shadow-sm"
//                                     >
//                                         <img
//                                             src={imageList[0].data_url}
//                                             alt="Main"
//                                             className="object-cover w-full h-full"
//                                         />
//                                         <button
//                                             type="button"
//                                             className="absolute top-2 right-2 bg-white px-2 rounded-full shadow"
//                                             onClick={() => onImageRemove(0)}
//                                         >
//                                             ✕
//                                         </button>
//                                         <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
//                                             <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded">
//                                                 Main Image
//                                             </span>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* ── Small grid (indexes 1…max) ── */}
//                             <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
//                                 {/* Uploaded thumbnails */}
//                                 {imageList.slice(1).map((img, idx) => {
//                                     const index = idx + 1;
//                                     return (
//                                         <div
//                                             key={index}
//                                             draggable
//                                             onDragStart={() => (dragItem.current = index)}
//                                             onDragEnter={() => (dragOverItem.current = index)}
//                                             onDragOver={(e) => e.preventDefault()}
//                                             onDragEnd={handleDragEnd}
//                                             className="relative rounded-lg overflow-hidden bg-white w-full h-[100px] shadow-sm"
//                                         >
//                                             <img
//                                                 src={img.data_url}
//                                                 alt={`Thumb ${index}`}
//                                                 className="object-cover w-full h-full"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 className="absolute top-2 right-2 bg-white px-2 rounded-full shadow"
//                                                 onClick={() => onImageRemove(index)}
//                                             >
//                                                 ✕
//                                             </button>
//                                         </div>
//                                     );
//                                 })}

//                                 {/* Small upload placeholder */}
//                                 {showSmallUpload && (
//                                     <div
//                                         key="upload-small"
//                                         className={`${smallDZ} ${isDragging ? "bg-gray-100" : ""
//                                             }`}
//                                         onClick={onImageUpload}
//                                         {...dragProps}
//                                     >
//                                         <IoMdPhotos className="w-6 h-6 text-gray-500 mb-1" />
//                                         <span className="font-medium text-sm">Add Photo</span>
//                                     </div>
//                                 )}

//                                 {/* Empty placeholders */}
//                                 {Array.from({ length: placeholders }).map((_, i) => (
//                                     <div
//                                         key={`ph-${i}`}
//                                         className="bg-gray-100 rounded-lg w-full h-[100px]"
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     );
//                 }}
//             </ImageUploading>
//         </div>
//     );
// };

// export default Photo;

import React, { useState, useEffect, useRef } from "react";
import ImageUploading from "react-images-uploading";
import { IoMdPhotos } from "react-icons/io";

const PhotoUploader = ({ initialImages = [], onImagesSelect }) => {
    const MAX_IMAGES = 12;

    // State holds objects like { data_url: string }
    const [images, setImages] = useState(
        initialImages.map((url) => ({ data_url: url }))
    );

    // Refs for HTML5 drag-and-drop
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    // Sync if initialImages change
    useEffect(() => {
        if (initialImages.length) {
            setImages(initialImages.map((url) => ({ data_url: url })));
        }
    }, [initialImages]);

    // Called when images are added/removed
    const handleChange = (imageList) => {
        setImages(imageList);
        onImagesSelect?.(imageList);
    };

    // Reorder images on drag end
    const handleDragEnd = () => {
        if (dragItem.current == null || dragOverItem.current == null) return;
        const list = Array.from(images);
        const [moved] = list.splice(dragItem.current, 1);
        list.splice(dragOverItem.current, 0, moved);
        dragItem.current = dragOverItem.current = null;
        setImages(list);
        onImagesSelect?.(list);
    };

    return (
        <div className="max-w-5xl mx-auto py-4">
            {/* Title + Subtitle */}
            <h2 className="text-2xl font-semibold mb-1">*Upload Your Images</h2>
            <p className="text-sm text-gray-600 mb-4">
                Please ensure your photos do not include phone numbers.
            </p>
            <div className="border-b mb-2"></div>

            {/* Counter */}
            <p className="text-sm text-gray-500 mb-2">
                {images.length}/{MAX_IMAGES} images uploaded
            </p>

            <ImageUploading
                multiple
                value={images}
                onChange={handleChange}
                maxNumber={MAX_IMAGES}
                dataURLKey="data_url"
                className='px-1'
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageRemove,
                    isDragging,
                    dragProps,
                }) => {
                    // Small-grid calculations
                    const smallSlots = MAX_IMAGES - 1;
                    const uploadedSmall = Math.max(imageList.length - 1, 0);
                    const showSmallUpload =
                        imageList.length >= 1 && imageList.length < MAX_IMAGES;
                    const placeholders =
                        smallSlots - uploadedSmall - (showSmallUpload ? 1 : 0);

                    // Shared Tailwind classes
                    const largeDropzoneCls = `
            border-2 border-dashed border-gray-300
            rounded-lg flex flex-col items-center justify-center
            text-center p-6 cursor-pointer
            w-full h-[315px]
          `;
                    const smallDropzoneCls = `
            border-2 border-dashed border-gray-300
            rounded-lg flex flex-col items-center justify-center
            text-center p-4 cursor-pointer
            w-full h-[100px]
          `;

                    return (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {/* ─── Main / Large Slot (index 0) ─── */}
                            <div className="md:col-span-2">
                                {imageList.length === 0 ? (
                                    <div
                                        className={`${largeDropzoneCls
                                            } ${isDragging ? "bg-gray-100" : ""}`}
                                        onClick={onImageUpload}
                                        {...dragProps}
                                    >
                                        <IoMdPhotos className="w-8 h-8 text-gray-500 mb-2" />
                                        <p className="font-medium text-sm">Drag &amp; Drop</p>
                                        <span className="mt-2 px-4 py-1 border rounded-full text-sm text-gray-700">
                                            Upload
                                        </span>
                                    </div>
                                ) : (
                                    <div
                                        draggable
                                        onDragStart={() => (dragItem.current = 0)}
                                        onDragEnter={() => (dragOverItem.current = 0)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDragEnd={handleDragEnd}
                                        className="relative rounded-lg overflow-hidden bg-gray-100 w-full h-[315px] shadow-sm"
                                    >
                                        <img
                                            src={imageList[0].data_url}
                                            alt="Main upload"
                                            className="object-contain w-full h-full"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 bg-white px-2 rounded-full shadow"
                                            onClick={() => onImageRemove(0)}
                                        >
                                            ✕
                                        </button>
                                        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-black bg-opacity-30 text-white text-xs px-2 py-1 rounded-full">
                                                Main Image
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ─── Small‐Grid (indexes 1…11) ─── */}
                            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                {/* Existing thumbnails */}
                                {imageList.slice(1).map((img, idx) => {
                                    const index = idx + 1;
                                    return (
                                        <div
                                            key={index}
                                            draggable
                                            onDragStart={() => (dragItem.current = index)}
                                            onDragEnter={() => (dragOverItem.current = index)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDragEnd={handleDragEnd}
                                            className="relative rounded-lg overflow-hidden bg-white w-full h-[100px] shadow-sm"
                                        >
                                            <img
                                                src={img.data_url}
                                                alt={`Thumbnail ${index}`}
                                                className="object-cover w-full h-full"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-2 right-2 bg-white px-2 rounded-full shadow"
                                                onClick={() => onImageRemove(index)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}

                                {/* Upload placeholder moves here */}
                                {showSmallUpload && (
                                    <div
                                        className={`${smallDropzoneCls
                                            } ${isDragging ? "bg-gray-100" : ""}`}
                                        onClick={onImageUpload}
                                        {...dragProps}
                                    >
                                        <IoMdPhotos className="w-6 h-6 text-gray-500 mb-1" />
                                        <span className="font-medium text-sm">Add Photo</span>
                                    </div>
                                )}

                                {/* Empty placeholders */}
                                {Array.from({ length: placeholders }).map((_, i) => (
                                    <div
                                        key={`ph-${i}`}
                                        className="bg-gray-100 rounded-lg w-full h-[100px]"
                                    />
                                ))}
                            </div>
                        </div>
                    );
                }}
            </ImageUploading>
        </div>
    );
};

export default PhotoUploader;

