import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'vKIhUiPik00_4a3K0q_O90khhPoKzewiSktE2K1T0BY';

const fetchImage = async (query) => {
    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: { query, per_page: 1 },
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
        });
        return response.data.results[0].urls.small;
    } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
        return null;
    }
};

export default fetchImage;
