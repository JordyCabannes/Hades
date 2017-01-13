"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
class DBManager {
    constructor() {
        this.url = 'mongodb://localhost:27017/hades';
        //console.log("call dbManager constructor");
    }
    insert_mongodb(table, data) {
        var insertDocument = function (db, callback) {
            db.collection(table).insertOne(data, function (err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into the " + table + " collection.");
                callback();
            });
        };
        MongoClient.connect(this.url, function (err, db) {
            assert.equal(null, err);
            insertDocument(db, function () {
                db.close();
            });
        });
    }
    ajouter_user(login, password, userType) {
        var data = {
            "login": login,
            "password": password,
            "typeofUser": userType,
            "date_joined": new Date(),
            "last_billed": new Date(),
            "owned_vms": []
        };
        this.insert_mongodb('users', data);
    }
    ajouter_vm_a_user(login, id_vm) {
        var add_vm_to_user = function (db, callback) {
            db.collection('users').update({ "login": login }, { $addToSet: { 'owned_vms': id_vm } }, function (err, result) {
                assert.equal(err, null);
                console.log("Added " + id_vm + " to " + login + "'s owned_vms list.");
                callback();
            });
        };
        MongoClient.connect(this.url, function (err, db) {
            assert.equal(null, err);
            add_vm_to_user(db, function () {
                db.close();
            });
        });
    }
    getTypeOfUser(userlogin) {
        return __awaiter(this, void 0, void 0, function* () {
            var functiongetuserType = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('users').findOne({ "login": userlogin });
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var result = yield functiongetuserType(db);
            return result.typeofUser;
        });
    }
    countUserNbVM(userlogin) {
        return __awaiter(this, void 0, void 0, function* () {
            var getListVm = function (db) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = yield db.collection('users').count({ "login": userlogin });
                    //console.log("------------------------",typeof(res.owned_vms));
                    return res;
                });
            };
            var db = yield MongoClient.connect(this.url);
            var NbVM = yield getListVm(db);
            //console.log("------------------------",typeof(PromisNbVM));
            return NbVM;
        });
    }
}
exports.DBManager = DBManager;
//# sourceMappingURL=dbManager.js.map