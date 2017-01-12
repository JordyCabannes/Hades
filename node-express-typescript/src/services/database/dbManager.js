"use strict";
class DBManager {
    constructor() {
        console.log("call dbManager constructor");
    }
    insert_mongodb(table, data) {
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        var ObjectId = require('mongodb').ObjectID;
        var url = 'mongodb://localhost:27017/hades';
        var insertDocument = function (db, callback) {
            db.collection(table).insertOne(data, function (err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into the " + table + " collection.");
                callback();
            });
        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            insertDocument(db, function () {
                db.close();
            });
        });
    }
    ajouter_user(login, password, user_class) {
        var data = {
            "login": login,
            "password": password,
            "user_class": user_class,
            "date_joined": new Date(),
            "last_billed": new Date(),
            "owned_vms": []
        };
        this.insert_mongodb('users', data);
    }
    ajouter_vm_a_user(login, id_vm) {
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        var ObjectId = require('mongodb').ObjectID;
        var url = 'mongodb://localhost:27017/hades';
        var add_vm_to_user = function (db, callback) {
            db.collection('users').update({ "login": login }, { $addToSet: { 'owned_vms': id_vm } }, function (err, result) {
                assert.equal(err, null);
                console.log("Added " + id_vm + " to " + login + "'s owned_vms list.");
                callback();
            });
        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            add_vm_to_user(db, function () {
                db.close();
            });
        });
    }
}
exports.DBManager = DBManager;
//# sourceMappingURL=dbManager.js.map