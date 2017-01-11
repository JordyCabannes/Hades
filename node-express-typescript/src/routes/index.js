"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const express_1 = require('express');
const proxmox_service_1 = require("../services/proxmox.service");
const index = express_1.Router();
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
    return __awaiter(this, void 0, void 0, function* () {
        var container = {
            ostemplate: 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
            vmid: 111,
            password: 'rootroot',
            memory: 1024
        };
        var proxmox = new proxmox_service_1.ProxmoxService('ip', 'node');
        var proxmoxApi = yield proxmox.connect('username', 'password');
        if (proxmoxApi != null) {
            var result = yield proxmoxApi.createLxcContainer(container);
            console.log(result);
        }
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = index;
//# sourceMappingURL=index.js.map