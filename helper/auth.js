module.exports = {
    isLoggedIn: function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    },
    authority: function (req, res, next){
        if(req.user.u_role=="admin" || req.user.u_role=="teacher" || req.user.t_id==req.params.id)
            return next();
        res.redirect("/dashboard");
    },
    isTeacher: function (req, res, next){
        if(req.isAuthenticated() && req.user.u_role=="teacher"){
            return next();
        }
        res.redirect("/login")
    },
    //Admin
    isAdmin: function (req, res, next){
        if(req.isAuthenticated() && req.user.u_role=="admin"){
            return next();
        }
        res.redirect("/login")
    }
}