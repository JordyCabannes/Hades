"use strict";
var mongodb_1 = require("mongodb");
var hydrate_mongodb_1 = require("hydrate-mongodb");
var model = require("./model");
var model_1 = require("./model");
var config = new hydrate_mongodb_1.Configuration();
config.addMapping(new hydrate_mongodb_1.AnnotationMappingProvider(model));
mongodb_1.MongoClient.connect('mongodb://127.0.0.1:27017/hades', function (err, db) {
    if (err)
        throw err;
    config.createSessionFactory(db, function (err, sessionFactory) {
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