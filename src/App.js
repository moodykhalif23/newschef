import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
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

  const viewRecipeDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setSelectedRecipe(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Chef App</h1>
      </header>
      <div className="panels-container">
        <div className="left-panel">
        <div className="recipe-header-fixed">
          <h2>Recipe Discovery</h2>
          {/* Search by Query */}
          <div className="search-section">
            <input
              type="text"
              placeholder="e.g., chicken soup"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={searchRecipes}>Search</button>
          </div>
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
