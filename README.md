# BackEnd course - continuation after the HTML & React introductory courses

* The goal was to build the backend for an e-commerce website representing an apparel e-commerce site.
* The server is Express, using Handlebars templates to render the views. MongoDB Atlas was used to store everything necessary, such as Products and Carts (containing products).
* The entry point to the app is app.js, where all the routes are defined and tested using Postman.
* The methods associated with each route are inside the folder "dao," within their respective JS classes (mainly for Product and Cart).
* At the beginning of the course, we simulated a database using JSON files. Later, we transitioned to Mongo, hence the presence of a folder called "models" within "dao" containing the schemas.
* The interactions with the DB are within the respective JS classes mentioned earlier, and the views to render are in the "views" folder.
