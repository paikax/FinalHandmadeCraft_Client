import * as httpRequest from '~/utils/httpRequest';

export const createOrder = async (orderRequest) => {
    try {
        const res = await httpRequest.post(`/orders/${orderRequest.userId}`, orderRequest);
        return res;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw the error to handle it elsewhere
    }
};

