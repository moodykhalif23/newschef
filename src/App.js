import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsQuery, setNewsQuery] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async (query = '') => {
    setNewsLoading(true);
    try {
      const params = query ? `?query=${query}` : '';
      const response = await axios.get(`http://localhost:5000/api/news${params}`);
      setNews(response.data.articles || []);
    } catch (error) {
      console.error(error);
    }
    setNewsLoading(false);
  };

  const searchRecipes = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes?query=${searchQuery}`);
      setRecipes(response.data.results || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const searchByIngredients = async () => {
    if (!ingredients) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/findByIngredients?ingredients=${ingredients}`);
      setRecipes(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const viewRecipeDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setSelectedRecipe(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      if (recipes.length >= 3) {
        // If recipes available, use first 3 for demo meal plan
        const plan = {
          meals: recipes.slice(0, 3).map((r, i) => ({
            id: r.id,
            title: r.title,
            image: r.image.split('-')[1], // e.g., '556x370'
            readyInMinutes: r.readyInMinutes || 30,
            mealType: i === 0 ? 'breakfast' : i === 1 ? 'lunch' : 'dinner'
          }))
        };
        console.log('Mock meal plan generated:', plan);
        setMealPlan(plan);
      } else {
        // Fallback: generate random plan or show message
        alert('Please search for recipes first to generate a meal plan.');
      }
    } catch (error) {
      console.error('Meal plan error:', error.message);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Chef App</h1>
      </header>
      <div className="panels-container">
        <div className="left-panel">
        <h2>Recipe Discovery</h2>

        {/* Search by Query */}
        <div className="search-section">
          <h2>Search Recipes</h2>
          <input
            type="text"
            placeholder="e.g., chicken soup"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={searchRecipes}>Search</button>
        </div>

        {/* Search by Ingredients */}
        <div className="search-section">
          <h2>Find Recipes by Ingredients</h2>
          <input
            type="text"
            placeholder="e.g., chicken, rice, broccoli"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <button onClick={searchByIngredients}>Find</button>
        </div>

        {/* Meal Plan */}
        <div>
          <h2>Generate Meal Plan</h2>
          <button onClick={generateMealPlan} disabled={loading}>Generate Day Plan</button>
          {mealPlan && (
            <div className="meal-plan">
              {mealPlan.meals && mealPlan.meals.map(meal => (
                <div key={meal.id} className="meal">
                  <h4>{meal.title}</h4>
                  <img src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.image}`} alt={meal.title} width={100} />
                  <p>Ready in {meal.readyInMinutes} min</p>
                </div>
              ))}
              <button onClick={() => setMealPlan(null)}>Close</button>
            </div>
          )}
        </div>

        {/* Recipes List */}
        <div className="recipes-list">
          {loading ? (
            <p>Loading...</p>
          ) : (
            recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card" onClick={() => viewRecipeDetails(recipe.id)}>
                <img src={recipe.image} alt={recipe.title} />
                <h3>{recipe.title}</h3>
                <p>Ready in {recipe.readyInMinutes} minutes</p>
              </div>
            ))
          )}
        </div>

      </div>

      <div className="right-panel">
        <div className="news-header-fixed">
          <h2>News Discovery</h2>
          {/* Search News */}
          <div className="search-section">
            <input
              type="text"
              placeholder="e.g., food, technology"
              value={newsQuery}
              onChange={(e) => setNewsQuery(e.target.value)}
            />
            <button onClick={() => fetchNews(newsQuery)}>Search</button>
          </div>
        </div>

        {/* News List */}
        <div className="news-list">
          {newsLoading ? (
            <p>Loading news...</p>
          ) : (
            news.slice(0, 10).map((article, index) => (
              <div key={index} className="news-card">
                <h3>{article.title}</h3>
                {article.urlToImage && <img src={article.urlToImage} alt={article.title} width={200} />}
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
              </div>
            ))
          )}
        </div>
      </div>
      </div>

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="recipe-details" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedRecipe.title}</h2>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} />
            <p dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }}></p>
            <h3>Instructions</h3>
            <div dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }}></div>
            <button onClick={() => setSelectedRecipe(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
