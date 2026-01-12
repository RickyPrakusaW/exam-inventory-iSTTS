const API_URL = 'http://localhost:5000/api/berita';

export const getBerita = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch berita');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching berita:', error);
        throw error;
    }
};

export const createBerita = async (data) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to create berita');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating berita:', error);
        throw error;
    }
};

export const updateBerita = async (id, data) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to update berita');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating berita:', error);
        throw error;
    }
};

export const deleteBerita = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete berita');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting berita:', error);
        throw error;
    }
};
