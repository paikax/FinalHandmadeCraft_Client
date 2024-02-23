import * as httpRequest from '~/utils/httpRequest';

export const getAllTasks = async () => {
    try {
        const res = await httpRequest.get('task');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const createTask = async (formData) => {
    try {
        const res = await httpRequest.post('task', formData);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getTaskById = async (id) => {
    try {
        const res = await httpRequest.getById('task', {
            params: {
                id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const updateTask = async (formData, id) => {
    try {
        const res = await httpRequest.update('task', formData, {
            params: {
                id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteTask = async (id) => {
    try {
        const res = await httpRequest.deleteById('task', {
            params: {
                id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};
