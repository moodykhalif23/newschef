# Chef App

A full-stack web application for discovering recipes, planning meals, and staying updated with the latest news. Built with a React frontend and an Express.js backend, this app leverages the Spoonacular API for recipe data and NewsAPI for news articles.

## Features

- **Recipe Search**: Search for recipes by keywords, ingredients, or dietary preferences
- **Recipe Details**: View comprehensive information about specific recipes, including ingredients, instructions, and nutritional data
- **Meal Planning**: Generate personalized meal plans based on calorie goals, diets, and exclusions
- **Nutrition Information**: Access detailed nutritional breakdowns for recipes
- **News Integration**: Stay informed with the latest news articles
- **Responsive Design**: Clean, user-friendly interface built with React

## Technologies Used

- **Frontend**: React 18, Axios for API calls
- **Backend**: Node.js, Express 5
- **APIs**: Spoonacular API, NewsAPI
- **Other**: CORS, Dotenv for environment variables, Nodemon for development

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- API keys for Spoonacular and NewsAPI

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/moodykhalif23/newschef.git
   cd chef
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```
   SPOONACULAR_API_KEY=your_spoonacular_api_key
   NEWS_API_KEY=your_news_api_key
   PORT=5000
   ```

4. Build the React app:
   ```
   npm run build
   ```

## Usage

### Development

To run both the server and client concurrently:
```
npm run dev:full
```

To run the server only:
```
npm run dev
```

To run the client only:
```
npm run client
```

### Production

```
npm start
```

The app will be available at `http://localhost:5000`.

## API Endpoints

### Recipes

- `GET /api/recipes` - Search recipes by query
  - Query parameters: `query`, `number` (default: 10)

- `GET /api/recipes/:id` - Get recipe details by ID

- `GET /api/recipes/findByIngredients` - Find recipes by ingredients
  - Query parameters: `ingredients` (comma-separated), `number` (default: 10)

- `GET /api/recipes/:id/nutritionWidget.json` - Get nutritional information for a recipe

### Meal Planning

- `POST /api/mealplan/generate` - Generate a meal plan
  - Body: `timeFrame` (default: 'day'), `targetCalories`, `diet`, `exclude`

### News

- `GET /api/news` - Get news articles
  - Query parameters: `query` (default: 'general'), `country` (default: 'us')

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Spoonacular API](https://spoonacular.com/food-api)
- [NewsAPI](https://newsapi.org/)