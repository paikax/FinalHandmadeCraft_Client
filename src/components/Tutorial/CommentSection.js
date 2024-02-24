// CommentSection.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const CommentSection = ({ comments, currentUserID, onDeleteComment }) => {
    return (
        <ul className="overflow-y-auto h-full">
            {comments && comments.length > 0 ? (
                comments.map((comment) => (
                    <li className="mb-4 border-b pb-4" key={comment.id}>
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="md:w-3/4">
                                <p className="text-xl mb-2">{comment.content}</p>
                            </div>
                            <div className="flex items-center justify-end md:w-1/4">
                                <small className="text-gray-500 mr-2">
                                    {new Date(comment.timestamp || comment.timeStamp).toLocaleString()}
                                </small>
                                {comment.userId === currentUserID && (
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => onDeleteComment(comment.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </li>
                ))
            ) : (
                <p>No comments yet</p>
            )}
        </ul>
    );
};

export default CommentSection;
