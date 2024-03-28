import React, { useEffect, useRef, useState } from 'react';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';
import setCanvasPreview from './setCanvasPreview';

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

function ImageCropper({ onCropComplete }) {
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState();
    const [error, setError] = useState('');
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [croppedImageVisible, setCroppedImageVisible] = useState(false);
    const onSelectFile = (e) => {
        // Reset the image source state to ensure a new render even if the same image is selected
        setImgSrc('');
        setError(''); // Clear any existing errors
        setCroppedImageVisible(false);

        const file = e.target.files[0];
        if (!file) {
            // If no file is selected, return early
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const imageElement = new Image();
            imageElement.src = reader.result;

            imageElement.onload = () => {
                // Check if the image meets the size requirements
                if (imageElement.naturalWidth < MIN_DIMENSION || imageElement.naturalHeight < MIN_DIMENSION) {
                    setError(`Image must be at least ${MIN_DIMENSION}px by ${MIN_DIMENSION}px`);
                    // If it doesn't, clear the imgSrc state
                    setImgSrc('');
                    return;
                }

                // If everything is fine, update the imgSrc state with the new image
                setImgSrc(imageElement.src);
            };

            imageElement.onerror = () => {
                // Handle errors related to loading the image (like if it's not really an image or is corrupted)
                setError('Error loading image.');
                setImgSrc('');
            };
        });

        reader.readAsDataURL(file);

        // Reset the file input value to ensure the change event fires even if the same file is selected again
        e.target.value = '';
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

        const crop = makeAspectCrop(
            {
                unit: '%',
                width: cropWidthInPercent,
            },
            ASPECT_RATIO,
            width,
            height,
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    };

    const handleCropComplete = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setCanvasPreview(
            imgRef.current,
            previewCanvasRef.current,
            convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height),
        );
        const dataUrl = previewCanvasRef.current.toDataURL();
        onCropComplete(dataUrl); // Pass the cropped image data back to the parent component
        setImgSrc(''); // Hide the cropper
        setCroppedImageVisible(true); // Show the cropped image preview
    };

    return (
        <>
            <span className="sr-only">Choose profile photo</span>
            <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="cursor-pointer bg-[#4a8f92] text-white w-full rounded-lg p-2 mt-2"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            {imgSrc && (
                <div className="flex flex-col items-center">
                    <ReactCrop
                        crop={crop}
                        onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                        circularCrop
                        keepSelection
                        aspect={ASPECT_RATIO}
                        minWidth={MIN_DIMENSION}
                    >
                        <img
                            ref={imgRef}
                            src={imgSrc}
                            alt="Upload"
                            style={{ maxHeight: '50vh' }}
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                    <button
                        className="bg-[#92C7CF] text-black ease-in-out duration-200 rounded-lg p-2 mt-4 hover:bg-[#AAD7D9]"
                        onClick={handleCropComplete}
                    >
                        Save
                    </button>
                </div>
            )}
            {crop && (
                <canvas
                    ref={previewCanvasRef}
                    className="mt-4"
                    style={{
                        display: croppedImageVisible === true ? 'block' : 'none', // Hide the canvas when isCroppedImageVisible is false
                        border: '1px solid black',
                        objectFit: 'contain',
                        margin: '0 auto',
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                    }}
                />
            )}
        </>
    );
}

export default ImageCropper;
