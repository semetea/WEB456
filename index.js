const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const session = require("express-session");

require("dotenv").config({path:'./config/key.env'});

//import router objects
const userRoutes = require("./routes/User");
const generalRoutes = require("./routes/General");
const roomRoutes = require("./routes/Admin");

//creation of app object
const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

app.use(session({secret:"This is my secret key."}))

app.use((req,res,next)=> { 
    res.locals.user = req.session.userInfo;
    res.locals.admin = req.session.adminInfo;
    next();
})


app.use("/",generalRoutes);
app.use("/user/",userRoutes);
app.user("/room/",roomRoutes);

//app.use("/",(req,res)=> {
//   res.render("General/404");
//})

//Handlebars as template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


const DBURL = `${process.env.DBURL}`;
mongoose.connect(DBURL,{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {
    console.log(`Database is connected`)
})
.catch(err=> {
    console.log(`Something went wrong:${err}`)
});


const PORT= process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`The web server started at PORT:${PORT}`);
});

