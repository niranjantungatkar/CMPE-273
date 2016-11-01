



/*
module.exports = function(passport) {
    passport.use('signin', new LocalStrategy(function(username, password, done) {

        mongo.connect(loginDatabase, function(connection) {

            var loginCollection = mongo.connectToCollection('login', connection);
            var whereParams = {
                username:username,
                password:password
            }

            process.nextTick(function(){
                loginCollection.findOne(whereParams, function(error, user) {

                    if(error) {
                        return done(err);
                    }

                    if(!user) {
                        return done(null, false);
                    }

                    if(user.password != password) {
                        done(null, false);
                    }

                    connection.close();
                    console.log(user.username);
                    done(null, user);
                });
            });
        });
    }));
}*/



exports.pAuth =  function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    if(err) {
      return next(err);
    }

    if(!user) {
      return res.redirect('/');
    }

    req.logIn(user, {session:false}, function(err) {
      if(err) {
        return next(err);
      }

      req.session.user = user.username;
      console.log("session initilized")
      return res.render('successLogin', {user:user});
    })
  })(req, res, next);
};