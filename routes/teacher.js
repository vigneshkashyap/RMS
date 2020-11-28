const   express     =   require("express"),
        router      =   express.Router(),
        pool        =   require("../config/db");

const {
    isAdmin,
    isLoggedIn,
    isTeacher,
    authority
} = require('../helper/auth');

router.get("/show", isAdmin, async (req, res) => {
    try{
        const Users =   await pool.query(
            'SELECT * FROM teacher ORDER BY t_id'
        );
        console.log(Users.rows);
        res.render("showfaculty", {teacher: Users.rows, user: req.user});
    }catch(err){
        console.log(err);
    }
});
router.get("/course/:id", isAdmin, async (req, res) => {
    try{
    const Courses   =   await pool.query(
        'Select c_id, c_name, c_credits from course WHERE course.t_id=($1)',
        [req.params.id]
    );
    res.render("showcourse", {course: Courses.rows, user: req.user});
    }catch(err){
        console.log(err);
    }
});

router.get("/course", isTeacher, async (req, res) => {
    try{
    const teacher=req.user.t_id;
    const Courses   =   await pool.query(
        'Select c_id, c_name, c_credits from course WHERE course.t_id=($1)',
        [req.user.t_id]
    );
    res.render("showcourse", {course: Courses.rows, user: req.user});
    }catch(err){
        console.log(err);
    }
});

router.get("/show/:id", isTeacher, async(req, res) => {
    try{
        const course    =   await pool.query(
            'SELECT c_name, c_id from course where c_id=$1',
            [req.params.id]
        );
        const students =   await pool.query(
            'SELECT student.s_id, student.s_name, coursereg.lab, coursereg.internal, coursereg.midsem, coursereg.endsem, coursereg.request, coursereg.show from coursereg LEFT JOIN student ON coursereg.s_id=student.s_id WHERE coursereg.c_id=($1) ORDER BY s_id',
            [req.params.id]
        );
        res.render("marks", {course: course.rows[0], student: students.rows, user: req.user});
    }catch(err){
        console.log(err);
    }
});
router.get("/edit/:id", isTeacher, async(req, res) => {
    try{
        const course    =   await pool.query(
            'SELECT c_name, c_id from course where c_id=$1',
            [req.params.id]
        );
        const students =   await pool.query(
            'SELECT student.s_id, student.s_name, coursereg.lab, coursereg.internal, coursereg.midsem, coursereg.endsem, coursereg.request from coursereg LEFT JOIN student ON coursereg.s_id=student.s_id WHERE coursereg.c_id=($1) ORDER BY s_id',
            [req.params.id]
        );
        res.render("marksedit", {course: course.rows[0], student: students.rows, user: req.user});
    }catch(err){
        console.log(err);
    }
});
router.put("/edit/:id", isTeacher, async (req, res) => {
    try{
        const students =   await pool.query(
            'SELECT student.s_id, student.s_name, coursereg.lab, coursereg.internal, coursereg.midsem, coursereg.endsem from coursereg LEFT JOIN student ON coursereg.s_id=student.s_id WHERE coursereg.c_id=($1) order BY s_id',
            [req.params.id]
        );
        if(students.rows.length>1){
            for(let i=0; i<students.rows.length; i++)
            {
                if(req.body.lab[i]!=null && req.body.lab[i]!=""){
                    const mark  =   await pool.query(
                        'UPDATE coursereg SET lab=($1) WHERE s_id=($2) AND c_id=($3)',
                        [req.body.lab[i], students.rows[i].s_id, req.params.id]    
                    );
                }if(req.body.internal[i]!=null && req.body.internal[i]!=""){
                    const mark  =   await pool.query(
                        'UPDATE coursereg SET internal=($1) WHERE s_id=($2) AND c_id=($3)',
                        [req.body.internal[i], students.rows[i].s_id, req.params.id]    
                    );
                }if(req.body.mid[i]!=null && req.body.mid[i]!=""){
                    const mark  =   await pool.query(
                        'UPDATE coursereg SET midsem=($1) WHERE s_id=($2) AND c_id=($3)',
                        [req.body.mid[i], students.rows[i].s_id, req.params.id]    
                    );
                }if(req.body.end[i]!=null && req.body.end[i]!=""){
                    const mark  =   await pool.query(
                        'UPDATE coursereg SET endsem=($1) WHERE s_id=($2) AND c_id=($3)',
                        [req.body.end[i], students.rows[i].s_id, req.params.id]    
                    );    
                }
            }
        }else{
            if(req.body.lab!=null && req.body.lab!=""){
                const mark  =   await pool.query(
                    'UPDATE coursereg SET lab=($1) WHERE s_id=($2) AND c_id=($3)',
                    [req.body.lab, students.rows[0].s_id, req.params.id]    
                );
            }if(req.body.internal!=null && req.body.internal!=""){
                const mark  =   await pool.query(
                    'UPDATE coursereg SET internal=($1) WHERE s_id=($2) AND c_id=($3)',
                    [req.body.internal, students.rows[0].s_id, req.params.id]    
                );
            }if(req.body.mid!=null && req.body.mid!=""){
                const mark  =   await pool.query(
                    'UPDATE coursereg SET midsem=($1) WHERE s_id=($2) AND c_id=($3)',
                    [req.body.mid, students.rows[0].s_id, req.params.id]    
                );
            }if(req.body.end!=null && req.body.end!=""){
                const mark  =   await pool.query(
                    'UPDATE coursereg SET endsem=($1) WHERE s_id=($2) AND c_id=($3)',
                    [req.body.end, students.rows[0].s_id, req.params.id]    
                );    
            }
        }
        res.redirect("/teacher/show/"+req.params.id);
    }catch(err){
        console.log(err);
    }
});


module.exports = router;