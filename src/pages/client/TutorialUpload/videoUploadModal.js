import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';

const VideoUploadModal = ({ onClose, onDrop, getInputProps, getRootProps, uploadProgress, isUploadComplete }) => {
    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#EEF5FF4F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const modalContentStyle = {
        background: '#86B6F6',
        padding: '30px 20px 20px 20px',
        borderRadius: '8px',
        textAlign: 'center',
        position: 'relative',
    };

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <button
                    onClick={onClose}
                    className="text-white mt-2 absolute top-[-4px] right-2 py-[1px] px-[5px] bg-[#B4D4FF] border-white hover:bg-[#EEF5FF] rounded "
                >
                    <FontAwesomeIcon icon={faDeleteLeft} className='text-[#176b87]'/>
                </button>
                {!isUploadComplete && (
                    <div
                        {...getRootProps()}
                        className="border-dashed border-gray-300 border-2 bg-[#176B87] p-8 text-center cursor-pointer"
                    >
                        <input {...getInputProps()} />
                        <p className="text-[white] text-3xl">Select videos to upload or drag and drop video files</p>
                        <div className='flex justify-between p-[10px]'>
                        <p className="mt-2 text-md text-[#EEF5FF]">Accepted file types: mp4</p>
                        <button className="text-[#176B87] bg-[#B4D4FF] rounded-md border border-solid border-white transition-all hover:bg-[#EEF5FF] py-2 px-2 ">
                            Upload video
                        </button>
                        </div>
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
            </div>
        </div>
    );
};

export default VideoUploadModal;
