import {Router} from 'express';
import {User, UserClass, Flavor} from "../model";

import sf = require("../server");
import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {ProxmoxService} from "../services/proxmox.service";
import {ProxmoxApiService} from "../services/proxmox-api.service";
import {ICreateLxcContainerReply} from "../interfaces/create-lxc-container-reply.interface";

const index = Router();

/* GET home page. */
index.get('/', function(req, res, next) {
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
    var insertDocument = function(db, callback) {
       db.collection('users').insertOne( {
          "login" : "test",
          "password" : "password",
          "user_class" : "Free",
          "date_joined" : "password",
          "last_billed" : "password",
          "owned_vms" : [17, 18, 19]
       }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the users collection.");
        callback();
      });
    };
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      insertDocument(db, function() {
          db.close();
      });
    });

});

/* GET Quick Start. */
index.get('/quickstart', async function(req, res, next) {
    var container : ICreateLxcContainerRequest = {
        ostemplate : 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
        vmid : 111,
        password : 'rootroot',
        memory:1024
    }

    var proxmox = new ProxmoxService('ip','node');
    var proxmoxApi : ProxmoxApiService = await proxmox.connect('username', 'password');
    if(proxmoxApi != null) {
        var result : ICreateLxcContainerReply = await proxmoxApi.createLxcContainer(container);
        console.log(result);
    }
});

export default index;
