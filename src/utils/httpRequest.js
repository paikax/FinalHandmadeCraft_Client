import axios from 'axios';

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

export const get = async (path, options = {}) => {
    const response = await httpRequest.get(path, options);
    return response.data;
};

export const post = async (path, formData, options = {}) => {
    const response = await httpRequest.post(path, formData, options);
    return response.data;
};

export const getById = async (path, options = {}) => {
    const response = await httpRequest.get(path, options);
    return response.data;
};

export const update = async (path, formData, options = {}) => {
    const response = await httpRequest.put(path, formData, options);
    return response.data;
};

export const deleteById = async (path, options = {}) => {
    const response = await httpRequest.delete(path, options);
    return response.data;
};

export default httpRequest;
