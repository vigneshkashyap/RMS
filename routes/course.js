const   express     =   require("express"),
        router      =   express.Router(),
        pool        =   require("../config/db");

const {
    isAdmin,
    isLoggedIn,
    isTeacher,
    authority
} = require('../helper/auth');

router.get("/show", isLoggedIn,async (req, res) => {
    try{
        const courses   =   await pool.query(
            'Select course.c_id, course.c_name, course.c_credits, teacher.t_department, teacher.t_name, teacher.t_id from course LEFT JOIN teacher on course.t_id=teacher.t_id;'
        );
        console.log(courses.rows);
        res.render("showcourse", {course: courses.rows, user: req.user});
    }catch (err){
        console.log(err);
    }
});
router.get("/show/:id", isLoggedIn,async(req, res) => {
    try{
        const c    =   await pool.query(
            'Select course.c_id, course.c_name, course.c_credits, teacher.t_department, teacher.t_name, teacher.t_id from course LEFT JOIN teacher on course.t_id=teacher.t_id WHERE course.c_id=($1)',
            [req.params.id]      
        );
        res.render("course", {course: c.rows[0], user: req.user});
    }catch (err){
        console.log(err);
    }
});
router.get("/add", isAdmin, (req, res) => res.render("addcourse", {user: req.user}));
router.post("/add", isAdmin, async (req, res) => {
    let {c_id, t_id, name, credits} =   req.body;
    const newCourse =   await pool.query(
        'Insert into "course" (c_id, c_name, c_credits, t_id) values ($1, $2, $3, $4)',
        [c_id, name, credits, t_id]
    );
    res.redirect("/course/show");
});
router.post("/select/:id", isLoggedIn, async (req, res) => {
    const s_id=req.user.s_id;
    const course    =   await pool.query(
        'INSERT INTO coursereg (c_id, s_id) values ($1, $2)',
        [req.params.id, s_id]
    );
    res.redirect("/course/show");
});
router.post("/deselect/:id", isLoggedIn, async (req, res) => {
    const s_id=req.user.s_id;
    const course    =   await pool.query(
        'DELETE FROM coursereg WHERE c_id=($1) AND s_id=($2)',
        [req.params.id, s_id]
    );
    res.redirect("/course/show");
});
router.post("/request/:cid/:sid", isLoggedIn ,async (req, res) =>{
    try{
    const updatecourse = await pool.query(
        'UPDATE coursereg SET request=true WHERE s_id=($1) and c_id=($2)',
        [req.params.sid, req.params.cid]
    );
    res.redirect("/student/course");
    }catch(err){
        console.log(err);
    }
});
router.post("/allow/:cid/:sid", isLoggedIn ,async (req, res) =>{
    try{
        console.log("Whats UP ");
    const updatecourse = await pool.query(
        'UPDATE coursereg SET show=true WHERE s_id=($1) and c_id=($2)',
        [req.params.sid, req.params.cid]
    );
    res.redirect("/teacher/show/"+req.params.cid);
    }catch(err){
        console.log(err);
    }
});


module.exports = router;