const   express     =   require("express"),
        router      =   express.Router(),
        pool        =   require("../config/db");

const auth = require("../helper/auth");
const {
        isAdmin,
        isLoggedIn,
        authority
    } = require('../helper/auth'); 

//FOR ADMIN ONLY  
router.post("/add", isAdmin, async(req, res) => {
    try{
        const user    = req.body;
        console.log(user);
        const newUser   =   await pool.query(
            'INSERT INTO student (s_name, s_age, s_gender, s_department, s_email, s_pass) VALUES ($1, $2, $3, $4, $5, $6)',
            [user.Name, user.Age, user.Gender, user.Dep, user.email, user.Password]
        );
    }catch (err){
        console.log(err);
    }
});

//ADMIN SHOW ALL STUDENTS
router.get("/show", isAdmin, async (req, res) => {
    try{
        const Users =   await pool.query(
            'SELECT * FROM student ORDER BY s_id'
        );
        console.log(Users.rows);
        res.render("showstudent", {student: Users.rows, user: req.user});
    }catch(err){
        console.log(err);
    }
});

router.get("/show/:id", [isLoggedIn, authority], async (req, res) => {
    try{
        const s   =   await pool.query(
            'SELECT * FROM student WHERE s_id=($1)',
            [req.params.id]
        );
        res.render("student", {student: s.rows[0], user: req.user});
    }catch(err){
        console.log(err);
    }
});

router.put("/show/:id", async (req, res) => {
    try{
        const {s_name, s_age, s_gender, s_department}  =   req.body;
        const newUser = await pool.query(
            'UPDATE student SET s_name=($1), s_age=($2), s_gender=($3), s_department=($4) WHERE s_id=($5)',
            [s_name, s_age, s_gender, s_department, req.params.id]
        );
        res.redirect("/student/show");
    }catch(err){
        console.log(err);
    }
});

router.get("/course", isLoggedIn,async (req, res) => {
    try{
        const Courses  =   await pool.query(
            'SELECT coursereg.c_id, course.c_name, course.c_credits, coursereg.internal, coursereg.midsem, coursereg.lab, coursereg.endsem, coursereg.show, coursereg.request from coursereg LEFT JOIN course ON course.c_id=coursereg.c_id WHERE coursereg.s_id=($1) ORDER BY coursereg.c_id',
            [req.user.s_id]
        );
        console.log(Courses.rows);
        res.render("mycourse", {course: Courses.rows, user: req.user})
    }catch(err){
        console.log(err);
    }
});



module.exports = router;