var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

export class DBManager  
{
    private url: string;

    public constructor() {
        this.url = 'mongodb://localhost:27017/hades';
    }

    public insert_mongodb(table: string, data: any) {
        var insertDocument = function(db, callback) {
            db.collection(table).insertOne(data, function(err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into the "+table+" collection.");
                callback();
            });
        };

        MongoClient.connect(this.url, function(err, db) {
            assert.equal(null, err);
            insertDocument(db, function() {
                db.close();
            });
        });
    }

    public ajouter_user(login: string, password: string, userType: string) {
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

/*

var vm = {
    proxmox_id
    node
    dedicated
    owner
    date_created
    date_deleted
    flavor_history = [
        date_changed
        flavor
        flavor_billing_rate
    ]
}

var flavor = {
    name
    cpus
    ram
    disk
    flavor_billing_rate
}

*/

    public ajouter_vm_a_user(login: string, id_vm: number) {
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

        MongoClient.connect(this.url, function(err, db) {
            assert.equal(null, err);
            add_vm_to_user(db, function() {
                db.close();
            });
        });
    }


    public async getTypeOfUser(userlogin: string): Promise<string> {

        var functiongetuserType = async function(db) {
             var res = await db.collection('users').findOne({"login": userlogin});
             return res;
        }

        var db = await MongoClient.connect(this.url);
        var result = await functiongetuserType(db);
        db.close();
        return result.typeofUser;
    }

    public async countUserNbVM(userlogin: string): Promise<number> {
        var getListVm = async function(db) {
            var res = await db.collection('users').count({"login":userlogin});
              //console.log("------------------------",typeof(res.owned_vms));
            return res;
        }

        var db = await MongoClient.connect(this.url);
        var NbVM =  await getListVm(db);
        db.close();
        //console.log("------------------------",typeof(PromisNbVM));
        return NbVM;
    }

    /*permet d'ajouter dans la collection backup, la chemin de la backup de la vm créée par l'utilisateur login*/
    public associateVmBackupToAnUser(login: string, vmid: number, backupPath: string) {
        var data = {
            "login": login,
            "vmid":vmid,
            "backupPath":backupPath
        };
        this.insert_mongodb('backup', data);
    }

    /*permet de savoir si l'utilisateur avait créé une backup pour la vm vmid*/
    public async hasBackupAssociateWithVm(login: string,vmid:number): Promise <boolean> {
        var functionhasBackup = async function(db) {
             var res = await db.collection('backup').count({"login": login, "vmid": vmid});
             return res;
        }

        var db = await MongoClient.connect(this.url);
        var result = await functionhasBackup(db);
        db.close();
        return result == 1;
    }
   
}
