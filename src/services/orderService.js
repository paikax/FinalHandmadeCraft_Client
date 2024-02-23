import * as httpRequest from '~/utils/httpRequest';

export const createOrder = async (tutorialId, userId) => {
    try {
        const res = await httpRequest.post(`/api/orders/${userId}`, { tutorialId });
        return res;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw the error to handle it elsewhere
    }
};
