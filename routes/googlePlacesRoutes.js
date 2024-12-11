const express = require('express');
const axios = require('axios');

const router = express.Router();

// Autocomplete route
router.get('/autocomplete', async (req, res) => {
    const { input } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
            params: {
                input,
                key: apiKey,
                language: 'en',
                components: 'country:ca', // Restrict to Canada
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching autocomplete:', error.message);
        res.status(500).json({ error: 'Failed to fetch autocomplete suggestions' });
    }
});

// Place details route
router.get('/place-details', async (req, res) => {
    const { place_id } = req.query;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!place_id) {
        return res.status(400).json({ error: 'place_id is required' });
    }

    const trimmedPlaceId = place_id.trim();

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: trimmedPlaceId,
                key: apiKey,
            },
        });

        if (response.data.status !== 'OK') {
            return res.status(400).json({ error: response.data.error_message || 'Invalid request' });
        }

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching place details:', error.message);

        if (error.response) {
            // Google API responded with an error
            return res.status(error.response.status).json({ error: error.response.data.error_message });
        }

        res.status(500).json({ error: 'Failed to fetch place details' });
    }
});

module.exports = router;
