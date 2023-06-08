# Weather Application

Enter a name of the city and it will return back infomration regarding it! 

## About the API
### Home Page(GET)
app.get("/", ...)<br>
Uses a GET request to display the home page. <br>
It displays the search bar, search button, and favorites button.

### Search Results(POST)
app.post("/weather",...)<br>
Displays a card regarding the weather information of the city.<br>
Returns infomration regarding the high temperature, low temperature, description about the conditions,
wind speeds, and more.

### History/Favorites(GET)
app.get("/history",...)<br>
Displays cards of the recent search history. <br>
Each card has displays the city, high and low temperatures, and an icon regarding the conditions.
