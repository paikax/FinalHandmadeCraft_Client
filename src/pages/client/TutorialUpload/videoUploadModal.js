import React from 'react';

const VideoUploadModal = ({ onClose, onDrop, getInputProps, getRootProps, uploadProgress, isUploadComplete }) => {
    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const modalContentStyle = {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
    };

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                {!isUploadComplete && (
                    <div
                        {...getRootProps()}
                        className="border-dashed border-2 border-gray-300 p-8 text-center cursor-pointer bg-gray-100"
                    >
                        <input {...getInputProps()} />
                        <p className="text-gray-600 text-3xl">Select videos to upload or drag and drop video files</p>
                        <p className="mt-2 text-md text-gray-500">Accepted file types: mp4</p>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded-md">
                            Upload video
                        </button>
                        {uploadProgress > 0 && (
                            <div className="w-full h-2 bg-gray-200 mt-2 rounded-md">
                                <div
                                    className="bg-green-500 h-full rounded-md"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                )}

                {isUploadComplete && (
                    <div>
                        <p className="text-green-500">Upload complete! Closing modal...</p>
                    </div>
                )}

                <button onClick={onClose} className="bg-red-500 text-white p-2 mt-2 rounded-md">
                    Close
                </button>
            </div>
        </div>
    );
};

export default VideoUploadModal;
