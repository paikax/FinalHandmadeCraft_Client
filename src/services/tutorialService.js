// tutorialService.js
import * as httpRequest from '~/utils/httpRequest';

export const getAllTutorials = async () => {
    try {
        const res = await httpRequest.get('tutorials');
        const tutorialsWithDetails = res.map(async (tutorial) => {
            const details = await getTutorialDetails(tutorial.id);
            return { ...tutorial, ...details };
        });
        return await Promise.all(tutorialsWithDetails);
    } catch (error) {
        console.log(error);
    }
};

export const getTutorialDetails = async (id) => {
    try {
        const res = await httpRequest.getById(`tutorials/${id}`);
        return { likes: res.likes, comments: res.comments };
    } catch (error) {
        console.log(error);
        throw error; // Re-throw the error to handle it elsewhere
    }
};

export const getTutorialById = async (id) => {
    try {
        const res = await httpRequest.getById(`tutorials/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw the error to handle it elsewhere
    }
};

export const createTutorial = async (tutorialData) => {
    try {
        const res = await httpRequest.post('tutorials', tutorialData);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const updateTutorial = async (id, tutorialData) => {
    try {
        const res = await httpRequest.update('tutorials', tutorialData, {
            params: {
                id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteTutorial = async (id) => {
    try {
        const res = await httpRequest.deleteById('tutorials', {
            params: {
                id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const addLikeToTutorial = async (tutorialId, userId) => {
    try {
        const response = await fetch(`/api/tutorials/${tutorialId}/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw new Error(`Failed to add like: ${response.statusText}`);
        }

        // Check if the response body is not empty before parsing as JSON
        const responseData = await response.text();
        return responseData ? JSON.parse(responseData) : null;
    } catch (error) {
        console.error('Error adding like:', error);
        throw error;
    }
};

export const removeLikeFromTutorial = async (tutorialId, likeId) => {
    try {
        const response = await fetch(`/api/tutorials/${tutorialId}/likes/${likeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to remove like: ${errorData.message || 'Unknown error'}`);
        }

        // Check if the response body is not empty before parsing as JSON
        const responseData = await response.text();
        return responseData ? JSON.parse(responseData) : null;
    } catch (error) {
        console.error('Error removing like:', error);
        throw error;
    }
};

export const addCommentToTutorial = async (tutorialId, commentContent, currentUserID) => {
    try {
        // Simulate an API call (replace this with your actual API endpoint)
        const response = await fetch(`/api/tutorials/${tutorialId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: commentContent, userId: currentUserID }),
        });

        if (!response.ok) {
            throw new Error('Failed to add comment');
        }

        // In a real scenario, you might return the added comment from the API response
        const addedComment = {
            id: new Date().getTime().toString(),
            content: commentContent,
            timestamp: new Date().toLocaleString(),
        };

        return addedComment;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

export const deleteCommentFromTutorial = async (tutorialId, commentId) => {
    try {
        const response = await fetch(`/api/tutorials/${tutorialId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to delete comment: ${errorData.message || 'Unknown error'}`);
        }

        // Check if the response body is empty
        const responseData = await response.text();
        return responseData ? JSON.parse(responseData) : null;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};

export const searchTutorials = async (searchTerm) => {
    try {
        const res = await httpRequest.get(`tutorials/search?searchTerm=${searchTerm}`);
        return res;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw the error to handle it elsewhere
    }
};

export const addReplyToComment = async (tutorialId, commentId, replyContent, currentUserID) => {
    try {
        const response = await fetch(`/api/tutorials/${tutorialId}/comments/${commentId}/replies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: replyContent, userId: currentUserID }),
        });

        if (!response.ok) {
            throw new Error('Failed to add reply');
        }

        // In a real scenario, you might return the added reply from the API response
        const addedReply = {
            id: new Date().getTime().toString(),
            content: replyContent,
            timestamp: new Date().toLocaleString(),
        };

        return addedReply;
    } catch (error) {
        console.error('Error adding reply:', error);
        throw error;
    }
};

export const deleteReplyFromComment = async (tutorialId, commentId, replyId) => {
    try {
        const response = await fetch(`/api/tutorials/${tutorialId}/comments/${commentId}/replies/${replyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to delete reply: ${errorData.message || 'Unknown error'}`);
        }

        // Check if the response body is empty
        const responseData = await response.text();
        return responseData ? JSON.parse(responseData) : null;
    } catch (error) {
        console.error('Error deleting reply:', error);
        throw error;
    }
};
