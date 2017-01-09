import {MongoClient} from "mongodb";
import {Configuration, AnnotationMappingProvider} from "hydrate-mongodb";
import * as model from "./model";
 
var config = new Configuration();
config.addMapping(new AnnotationMappingProvider(model));

MongoClient.connect('mongodb://127.0.0.1:27017', (err, db) => {
    if(err) throw err;
    
    config.createSessionFactory(db, (err, sessionFactory) => {
    });
});

