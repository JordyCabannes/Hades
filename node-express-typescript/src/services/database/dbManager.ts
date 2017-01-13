var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

export class DBManager  
{
    private url :string;


    public constructor()
    {
        this.url=  'mongodb://localhost:27017/hades';
        //console.log("call dbManager constructor");
    }

    public  insert_mongodb(table: string, data: any)
    {
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

    public ajouter_user(login: string, password: string, userType: string)
    {
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

    public ajouter_vm_a_user(login: string, id_vm: number)
    {
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


    public  async getTypeOfUser(userlogin : string) : Promise<string>
    {

        var functiongetuserType = async function(db)
        {
             var res = await db.collection('users').findOne({"login":userlogin});
             return res;
        }

        var db = await MongoClient.connect(this.url);
        var result =  await functiongetuserType(db);
        return result.typeofUser;
    }

    public async countUserNbVM(userlogin:string) :  Promise<number>
    {
        var getListVm = async function(db)
        {
            var res =  await db.collection('users').count({"login":userlogin});
              //console.log("------------------------",typeof(res.owned_vms));
            return res;
        }

        var db = await MongoClient.connect(this.url);
        var NbVM =  await getListVm(db);
        //console.log("------------------------",typeof(PromisNbVM));
        return NbVM;
    }
   
}
