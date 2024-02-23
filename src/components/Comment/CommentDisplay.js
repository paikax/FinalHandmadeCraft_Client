import React from 'react';

const CommentsDisplay = ({ comments }) => {
    return (
        <div>
            <h2>Comments:</h2>
            {comments.map((comment) => (
                <div key={comment.id}>
                    <p>{comment.Content}</p>
                    <p>Time: {new Date(comment.TimeStamp.$date).toLocaleString()}</p>
                    <hr />
                </div>
            ))}
        </div>
    );
};

export default CommentsDisplay;
