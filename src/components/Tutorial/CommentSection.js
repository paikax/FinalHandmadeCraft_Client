// CommentSection.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const CommentSection = ({ comments, currentUserID, onDeleteComment }) => {
    return (
        <ul className="overflow-y-auto h-full">
            {comments && comments.length > 0 ? (
                comments.map((comment) => (
                    <li className="mb-6 border-b pb-6" key={comment.id}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="md:w-3/4">
                                <p className="text-lg md:text-xl mb-2">{comment.content}</p>
                                <small className="text-gray-500">
                                    {new Date(comment.timestamp || comment.timeStamp).toLocaleString()}
                                </small>
                            </div>
                            <div className="flex items-center justify-end md:w-1/4 mt-4 md:mt-0">
                                {comment.userId === currentUserID && (
                                    <button
                                        className="text-red-500 hover:text-red-700 focus:outline-none"
                                        onClick={() => onDeleteComment(comment.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} className="text-xl" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </li>
                ))
            ) : (
                <li className="text-gray-500">No comments yet</li>
            )}
        </ul>
    );
};

export default CommentSection;
