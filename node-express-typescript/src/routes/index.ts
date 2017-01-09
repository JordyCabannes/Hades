import {Router} from 'express';

const index = Router();

/* GET home page. */
index.get('/', function(req, res, next) {
  var session = sessionFactory.createSession();
  var user = new User("test", "test", UserClass.Free);
  session.save(user);
  res.render('index', { title: 'Visual Studio Code!' });
  session.close(next);
});

/* GET Quick Start. */
index.get('/quickstart', function(req, res, next) {
  console.log("lol");
});

export default index;
