"use strict";
const mongodb_1 = require("mongodb");
const hydrate_mongodb_1 = require("hydrate-mongodb");
const model = require("./model");
const model_1 = require("./model");
var config = new hydrate_mongodb_1.Configuration();
config.addMapping(new hydrate_mongodb_1.AnnotationMappingProvider(model));
mongodb_1.MongoClient.connect('mongodb://127.0.0.1:27017/hades', (err, db) => {
    if (err)
        throw err;
    config.createSessionFactory(db, (err, sessionFactory) => {
        // v = sessionFactory;
        var session = sessionFactory.createSession();
        var user = new model_1.User("test", "test", model_1.UserClass.Free);
        console.log(db);
        console.log(sessionFactory);
        session.save(user);
        session.close();
    });
});
//# sourceMappingURL=server.js.map