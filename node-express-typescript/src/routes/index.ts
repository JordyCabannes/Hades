import {Router} from 'express';
import { UserClass } from "../model";

import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {ProxmoxService} from "../services/proxmox.service";
import {ProxmoxApiService} from "../services/proxmox-api.service";
import {ICreateLxcContainerReply} from "../interfaces/create-lxc-container-reply.interface";

const index = Router();
/* GET home page. */
index.get('/', function(req, res, next) {
    // ajouter_user('coucou', 'blah', UserClass.Free)
    ajouter_vm_a_user('coucou', 130)
    console.log("lolilol");
});

/* GET Quick Start. */
index.get('/quickstart', async function(req, res, next) {
    var container : ICreateLxcContainerRequest = {
        ostemplate : 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
        vmid : 111,
        password : 'rootroot',
        memory:1024
    }

    var proxmox = new ProxmoxService('ip','ns3060138');
    var proxmoxApi : ProxmoxApiService = await proxmox.connect('root@pam', 'password');
    if(proxmoxApi != null) {
        var result : ICreateLxcContainerReply = await proxmoxApi.createLxcContainer(container);
        console.log(result);
    }
});


function insert_mongodb(table: string, data: any): void {
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    var url = 'mongodb://localhost:27017/hades';

    var insertDocument = function(db, callback) {
        db.collection(table).insertOne(data, function(err, result) {
            assert.equal(err, null);
            console.log("Inserted a document into the "+table+" collection.");
            callback();
        });
    };

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertDocument(db, function() {
            db.close();
        });
    });
}

function ajouter_user(login: string, password: string, user_class: UserClass): void {
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

function ajouter_vm_a_user(login: string, id_vm: number): void {
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    var url = 'mongodb://localhost:27017/hades';

    var add_vm_to_user = function (db, callback) {
        db.collection('users').update(
            {"login": login},
            {$addToSet: {'owned_vms': id_vm}},
            function(err, result) {
                assert.equal(err, null);
                console.log("Added "+id_vm+" to "+login+"'s owned_vms list.");
                callback();
        });
    }

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        add_vm_to_user(db, function() {
            db.close();
        });
    });
}


export default index;
