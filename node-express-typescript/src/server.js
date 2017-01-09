"use strict";
var mongodb_1 = require("mongodb");
var hydrate_mongodb_1 = require("hydrate-mongodb");
var model = require("./model");
var config = new hydrate_mongodb_1.Configuration();
config.addMapping(new hydrate_mongodb_1.AnnotationMappingProvider(model));
mongodb_1.MongoClient.connect('mongodb://127.0.0.1:27017', function (err, db) {
    if (err)
        throw err;
    config.createSessionFactory(db, function (err, sessionFactory) {
    });
});
//# sourceMappingURL=server.js.map