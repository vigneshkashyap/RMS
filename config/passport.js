const   pool    = require('./db.js'),
        bcrypt  = require('bcryptjs');
        LocalStrategy   =   require("passport-local").Strategy;

module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    },
        function(username, password, done) {
        pool.connect(function(poolErr, poolClient, poolDone) {
          if(poolErr) {
            return console.error('pool client fetch error', poolErr);
          }
          poolClient.query('SELECT u_id, u_email, u_password, u_role FROM "user" WHERE u_email = ($1)', [username], function(queryErr, queryRes) {
            if(queryErr) {
              return console.error('query error', queryErr);
            }
            if(queryRes.rows[0] != undefined)
            {
                bcrypt.compare(password, queryRes.rows[0].u_password, function(compareErr, compareRes) {
                  if(compareErr) {
                    return console.error('bcrypt error', compareErr);
                  }
                  if(compareRes) {
                      if(queryRes.rows[0].u_role=="teacher"){
                        poolClient.query(
                              'SELECT * from teacher WHERE t_email=($1)',
                              [queryRes.rows[0].u_email], function(err, ans){
                                  if(err){
                                      console.log(err);
                                  }else{ 
                                    ans.rows[0].u_role="teacher";
                                    done(null, ans.rows[0]);
                                  }
                              });
                      }
                      else if(queryRes.rows[0].u_role=="student"){
                        poolClient.query(
                            'SELECT * from student WHERE s_email=($1)',
                            [queryRes.rows[0].u_email], function(err, ans){
                                if(err){
                                    console.log(err);
                                }else{
                                    ans.rows[0].u_role="student";
                                    done(null, ans.rows[0]);
                                }
                            });
                        }else{
                          done(null, queryRes.rows[0]);
                        }
                  }else {
                      done(null, null);
                  }
                  poolDone();
                });
            }else {
              //user not found
              poolDone();
              done(null, null);
            }
          });
        });
      }));
    passport.serializeUser(function(user, done) {
    done(null, user);
    });passport.deserializeUser(function(user, done) {
    done(null, user);
    });   
}