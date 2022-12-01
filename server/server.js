const express = require("express");
//instantiate new instance of express
const app = express();
//declare port varible to be whatver port heroku picks or can be 3000 for local
const PORT = process.env.PORT || 3000;

// serve static files
app.use(express.static("../client/dist"));
//parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes/htmlRoutes")(app);

app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));
