const express = require('express');
const methodOverride = require("method-override");
require("dotenv").config();
const database = require("./config/database");

const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();


const app = express();
app.use(methodOverride("_method"));
const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');


//App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//cau hinh filetinhx
app.use(express.static("public"));

//routes
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
