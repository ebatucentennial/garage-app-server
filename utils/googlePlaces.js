const axios = require('axios');

// Fetch autocomplete suggestions from Google Places API
const fetchAutocompleteSuggestions = async (input) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;

    try {
        const response = await axios.get(apiUrl, {
            params: {
                input,              // User's input for address
                key: apiKey,        // Google API Key
                language: 'en',     // Language for suggestions
                types: 'geocode',   // Limit results to addresses
                components: 'country:ca', // Restrict to Canada (adjust if needed)
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        throw error;
    }
};

module.exports = { fetchAutocompleteSuggestions };
