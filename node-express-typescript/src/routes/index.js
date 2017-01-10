"use strict";
var express_1 = require("express");
var index = express_1.Router();
/* GET home page. */
index.get('/', function (req, res, next) {
    // var session = sf.v.createSession();
    // var user = new User("test", "test", UserClass.Free);
    // session.save(user);
    // res.render('index', { title: 'Visual Studio Code!' });
    // session.close(next);
    console.log("lolilol");
    //En MongoDB classique
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    var url = 'mongodb://localhost:27017/hades';
    var insertDocument = function (db, callback) {
        db.collection('users').insertOne({
            "login": "test",
            "password": "password",
            "user_class": "Free",
            "date_joined": "password",
            "last_billed": "password",
            "owned_vms": [17, 18, 19]
        }, function (err, result) {
            assert.equal(err, null);
            console.log("Inserted a document into the users collection.");
            callback();
        });
    };
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        insertDocument(db, function () {
            db.close();
        });
    });
});
/* GET Quick Start. */
index.get('/quickstart', function (req, res, next) {
    console.log("lol");
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = index;
//# sourceMappingURL=index.js.map