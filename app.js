const   express         =   require("express"),
        methodOverride  =   require("method-override"),
        session         =   require("express-session"),
        passport        =   require("passport"),
        $               =   require("jquery");
        
const app=express();
const port =    process.env.PORT || 8000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(session({
    secret: 'thatsecretthinggoeshere',
    resave: false,
    saveUninitialized: true
}));

const {
    isAdmin,
    isLoggedIn,
    authority
} = require('./helper/auth'); 

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));

app.get('/dashboard', isLoggedIn,async (req, res) => {
    res.render('dashboard', {user: req.user});
});

//Create a Student
app.use("/student", require("./routes/student"));
app.use("/teacher", require("./routes/teacher"));
app.use("/course", require("./routes/course"));
app.use("/", require("./routes/index"));

app.listen(port, () =>{
    console.log(`Server started at localhost:${port}`);
});