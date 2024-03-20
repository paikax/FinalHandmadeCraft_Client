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
        const res = await httpRequest.post(`tutorials/${tutorialId}/likes`, { userId });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const removeLikeFromTutorial = async (tutorialId, likeId) => {
    try {
        const res = await httpRequest.deleteById(`tutorials/${tutorialId}/likes/${likeId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const addCommentToTutorial = async (tutorialId, commentContent, currentUserID) => {
    try {
        const res = await httpRequest.post(`tutorials/${tutorialId}/comments`, {
            content: commentContent,
            userId: currentUserID,
        });
        const addedComment = {
            id: new Date().getTime().toString(),
            content: commentContent,
            timestamp: new Date().toLocaleString(),
        };

        return addedComment;
    } catch (error) {
        console.log(error);
    }
};

export const deleteCommentFromTutorial = async (tutorialId, commentId) => {
    try {
        const res = await httpRequest.deleteById(`tutorials/${tutorialId}/comments/${commentId}`);
        return res;
    } catch (error) {
        console.log(error);
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
        const res = await httpRequest.post(`tutorials/${tutorialId}/comments/${commentId}/replies`, {
            content: replyContent,
            userId: currentUserID,
        });

        const addedReply = {
            id: new Date().getTime().toString(),
            content: replyContent,
            timestamp: new Date().toLocaleString(),
        };

        return addedReply;
    } catch (error) {
        console.log(error);
    }
};

export const deleteReplyFromComment = async (tutorialId, commentId, replyId) => {
    try {
        const res = await httpRequest.deleteById(`tutorials/${tutorialId}/comments/${commentId}/replies/${replyId}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};
