const   express     =   require("express"),
        router      =   express.Router(),
        pool        =   require("../config/db"),
        passport    =   require("passport"),
        bcrypt      =   require("bcryptjs");

const {
        isAdmin,
        isLoggedIn,
        authority
    } = require('../helper/auth'); 
router.get("/register", isAdmin, (req, res) => {
    res.render("register", {user: req.user});
});


router.post("/register", async (req, res) => {
    try{
        let {FirstName, LastName, email, password, age, gender, department, designation, role}  =   req.body;
        
        let hashPass    =   await bcrypt.hash(password, 10);
        const name=FirstName+" "+LastName;
        if(role=="student"){
        const newUser = await pool.query(
            'INSERT INTO student (s_name, s_email, s_pass, s_age, s_gender, s_department) VALUES ($1, $2, $3, $4, $5, $6)',
            [name, email, hashPass, age, gender, department]
        );
        const newU  =   await pool.query(
            'INSERT INTO "user" (u_email, u_password, u_role) VALUES ($1, $2, $3)',
            [email, hashPass, role]
        );
        res.redirect("/login");  
        } else if(role=="teacher"){
            const newUser = await pool.query(
                'INSERT INTO teacher (t_name, t_email, t_pass, t_age, t_gender, t_department, t_designation) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [name, email, hashPass, age, gender, department, designation]
            );
            const newU  =   await pool.query(
                'INSERT INTO "user" (u_email, u_password, u_role) VALUES ($1, $2, $3)',
                [email, hashPass, role]
            );
            res.redirect("/login");  
        } else{
            const adim = await pool.query(
                'INSERT INTO "user" (u_email, u_password, u_role) VALUES ($1, $2, $3)',
                [email, hashPass, role]
            );
            res.redirect("/login");
        }
    }catch(err){
        console.log(err);
    }
});

//Login 
router.get("/", (req, res) => res.redirect("/login"));
router.get("/login", (req, res) => res.render("login"));
router.post("/login", 
    passport.authenticate('local', { failureRedirect: "/login"}), 
    (req, res) => res.redirect("/dashboard"));
module.exports = router;

//Logout
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});