import axios from 'axios';

const baseURL = 'http://localhost:3000/api/v1/diaries';

export const getDiaryEntries = async (token: string) => {
    try {
        const response = await axios.get(`${baseURL}/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching diary entries:', error);
        throw error;
    }
};

export const getDiaryEntryById = async (id: string, token: string) => {
    try {
        const response = await axios.get(`${baseURL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching diary entry by ID:', error);
        throw error;
    }
};

export const createDiaryEntry = async (data: any, token: string) => {
    try {
        const response = await axios.post(baseURL, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating diary entry:', error);
        throw error;
    }
};

export const updateDiaryEntry = async (id: string, data: any, token: string) => {
    try {
        const response = await axios.post(`${baseURL}/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating diary entry:', error);
        throw error;
    }
};
