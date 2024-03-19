import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faReply } from '@fortawesome/free-solid-svg-icons';

const CommentSection = ({ comments, currentUserID, onDeleteComment, onOpenReplyModal, onDeleteReply }) => {
    // Function to format timestamps to relative time
    const formatRelativeTime = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ${hours === 1 ? 'hr' : 'hrs'} ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        const years = Math.floor(days / 365);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    };

    return (
        <ul className="space-y-6 max-h-96 overflow-y-auto">
            {comments && comments.length > 0 ? (
                comments.map((comment) => (
                    <li className="border border-gray-200 rounded-md p-4" key={comment.id}>
                        <div className="flex flex-col md:flex-row md:justify-between items-start">
                            <div className="w-full md:w-3/4">
                                <p className="text-lg md:text-xl mb-2">{comment.content}</p>
                                <small className="text-sm text-gray-500">
                                    {formatRelativeTime(comment.timestamp || comment.timeStamp)}
                                </small>
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="mt-4 border-l-2 border-gray-400 pl-4">
                                        <p className="text-sm font-semibold mb-2">Replies:</p>
                                        <ul className="ml-4">
                                            {comment.replies.map((reply) => (
                                                <li key={reply.id} className="mb-2">
                                                    <p className="text-lg">{reply.content}</p>
                                                    <small className="text-sm text-gray-500">
                                                        {formatRelativeTime(reply.timeStamp)}
                                                    </small>
                                                    {reply.userId === currentUserID && (
                                                        <button
                                                            className="text-red-500 hover:text-red-700 focus:outline-none ml-2"
                                                            onClick={() => onDeleteReply(comment.id, reply.id)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} className="text-xl" />
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center mt-4 md:mt-0">
                                <button
                                    className="text-[#176B87] hover:text-[#5cabc5] focus:outline-none px-2 ml-4 text-lg"
                                    onClick={() => onOpenReplyModal(comment.id)}
                                >
                                    <FontAwesomeIcon icon={faReply} className="mr-2" />
                                    Reply
                                </button>
                                {comment.userId === currentUserID && (
                                    <button
                                        className="text-red-500 hover:text-red-700 focus:outline-none ml-4"
                                        onClick={() => onDeleteComment(comment.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} className="text-lg" />
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
