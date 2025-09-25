const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

// Search recipes by query
app.get('/api/recipes', async (req, res) => {
  const { query, number = 10 } = req.query;
  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query,
        number,
        addRecipeInformation: true,
        fillIngredients: true
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recipe details by ID
app.get('/api/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/${id}/information`, {
      params: {
        apiKey: SPOONACULAR_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Find recipes by ingredients
app.get('/api/recipes/findByIngredients', async (req, res) => {
  const { ingredients, number = 10 } = req.query;
  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/findByIngredients`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        ingredients: ingredients.split(',').map(i => i.trim()).join(','),
        number,
        ranking: 1 // Maximize used ingredients
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate meal plan
app.post('/api/mealplan/generate', async (req, res) => {
  const { timeFrame = 'day', targetCalories, diet, exclude } = req.body;
  try {
    const params = {
      apiKey: SPOONACULAR_API_KEY,
      timeFrame
    };
    if (targetCalories) params.targetCalories = targetCalories;
    if (diet) params.diet = diet;
    if (exclude) params.exclude = exclude;

    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/mealplans/generate`, {
      params
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get nutritional info for a recipe
app.get('/api/recipes/:id/nutritionWidget.json', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/${id}/nutritionWidget.json`, {
      params: {
        apiKey: SPOONACULAR_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
