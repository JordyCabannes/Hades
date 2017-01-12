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
    // ajouter_user('coucou', 'blah', UserClass.Free)
    ajouter_vm_a_user('coucou', 130);
    console.log("lolilol");
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
        var proxmox = new proxmox_service_1.ProxmoxService('ip', 'ns3060138');
        var proxmoxApi = yield proxmox.connect('root@pam', 'password');
        if (proxmoxApi != null) {
            var result = yield proxmoxApi.createLxcContainer(container);
            console.log(result);
        }
    });
});
function insert_mongodb(table, data) {
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
function ajouter_user(login, password, user_class) {
    var data = {
        "login": login,
        "password": password,
        "user_class": user_class,
        "date_joined": new Date(),
        "last_billed": new Date(),
        "owned_vms": []
    };
    insert_mongodb('users', data);
}
function ajouter_vm_a_user(login, id_vm) {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = index;
//# sourceMappingURL=index.js.map