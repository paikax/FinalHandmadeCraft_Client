// categoryService.js
import * as httpRequest from '~/utils/httpRequest';

export const getAllCategories = async () => {
    try {
        const response = await httpRequest.get('categories');
        return response;
    } catch (error) {
        throw new Error('Error fetching categories');
    }
};
