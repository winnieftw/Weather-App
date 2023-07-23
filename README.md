# Weather Application

Enter a name of the city and it will return back its weather info! 

## About the API
### Home Page(GET)
- app.get("/", ...)
- Uses a GET request to display the home page. 
- It displays the search bar, search button, and favorites button.

### Search Results(POST)
- app.post("/weather",...)
- Displays a card regarding the weather information of the city.
- Returns information regarding the high temperature, low temperature, description about the conditions,
wind speeds, and more.

### History/Favorites(GET)
- app.get("/history",...)
- Displays cards of the recent search history. 
- Each card has displays the city, high and low temperatures, and an icon regarding the conditions.

### Weather API Link: https://openweathermap.org/api
### NOTE
- There are some limitations to this application.
- If you're curious about the limitations, feel free to ask.


