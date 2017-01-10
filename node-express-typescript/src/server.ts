import {MongoClient} from "mongodb";
import {Configuration, AnnotationMappingProvider} from "hydrate-mongodb";
import * as model from "./model";
import {User, UserClass, Flavor} from "./model";

var config = new Configuration();
config.addMapping(new AnnotationMappingProvider(model));
export var v;

MongoClient.connect('mongodb://127.0.0.1:27017/hades', (err, db) => {
    if(err) throw err;
    
    config.createSessionFactory(db, (err, sessionFactory) => {
    	// v = sessionFactory;
    	var session = sessionFactory.createSession();
		var user = new User("test", "test", UserClass.Free);
		console.log(db)
		console.log(sessionFactory)
		session.save(user);
		session.close();
    });
});
