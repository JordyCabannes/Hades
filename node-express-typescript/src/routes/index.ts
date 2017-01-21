import {Router} from 'express';
import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {ProxmoxService} from "../services/proxmox.service";
import {ProxmoxApiService} from "../services/proxmox-api.service";
import {IGetClusterVmNextIdReply} from "../interfaces/get-cluster-vm-next-id-reply.interface";
import {IGetContainerStatusReply} from "../interfaces/get-container-status-reply.interface";
import {DBManager}  from "../services/database/dbManager" ;
import {BackupCompress,BackupModes} from "../interfaces/create-container-backup-request";
import {FrameselfService} from "../services/frameself.service";
import {ProxmoxUtils} from "../utils/proxmox.utils";
import {IUpidReply} from "../interfaces/upid-reply.interface";

var frameself = new FrameselfService('127.0.0.1', 5000);
const index = Router();

/*db Manager*/
var db= new DBManager();

var cors=require('cors');


index.options('/*', cors());


/* GET home page. */
index.get('/', function(req, res, next)
{
    db.ajouter_user("coucou", "prout", "Free");
    db.old_ajouter_vm_a_user('coucou', 130); //changer plus tard pour ajouter_vm_a_user()
    db.associateVmBackupToAnUser("coucou",130,"/home/zaurelezo");
    console.log("lolilol");
});


index.get("/User/:login",cors(), async function(req, res, next)
{
    var user = await  db.get_user(req.params.login);
    if (user)
    {
        //res.send({"login":user.login,"password":user.password, "typeofUser":user.typeofUser});
        res.send({"user":user[0]});
    }else
    {

        res.send({"User":"ko","Information":"ko"});
    }
});


/*add user account*/
index.post("/createAccount", cors(), async function(req, res, next)
{
    var resHasAccount = await db.hasAnAccount(req.body.login,req.body.password);
    if (!resHasAccount)
    {
        db.ajouter_user(req.body.login,req.body.password,req.body.typeofUser);
        res.send({"addUser":"ok","Information":"Account created"});
    }else
    {

        res.send({"addUser":"ko","Information":"Already has an account"});
    }
});


index.get("/UserVMs/:login",cors(), async function(req, res, next)
{
    var listVM = await  db.list_all_vms_user(req.params.login);

    res.send({"listVM":listVM});

});

index.get("/VM/:id",cors(), async function(req, res, next)
{
    var VM = await  db.getVm(req.params.id);
    res.send({"VM":VM[0]});

});


/*sign in*/
index.post("/signIn", cors(), async function(req, res, next)
{
    console.log("valeur de login"+req.params.login);
    console.log("valeur de password"+req.params.password);
    var resHasAccount = await db.hasAnAccount(req.body.login,req.body.password);
    if (resHasAccount)
    {
        res.send({"signIn":"ok","Information":"ok"});
    }else
    {
        res.send({"signIn":"ko","Information":"Wrong login or password"});
    }
});

/* post createVM */
index.post('/createVM', cors(), async function(req, res, next)
{
    console.log("================== request body" + req.body);
    //connection
    var proxmoxApi : ProxmoxApiService = await ProxmoxUtils.getPromoxApi();

    //free or premium
    var typeUser = await db.getTypeOfUser(req.body.login);
    var numberVM =  await db.countUserNbVM(req.body.login);
    console.log(".............****************************", typeUser);
    console.log("..............********************************",numberVM);
    if (typeUser=="Free" && numberVM > 0)
    {
        res.send({"containerID":-1,"Information":"Cannot create more vm"})
    }else
    {

        if(proxmoxApi != null)
        {
            var ObjectID  :IGetClusterVmNextIdReply  = await  proxmoxApi.getClusterVmNextId() ;

            //TODO: gérer plus tard  le fait que l'user premium doit spécifier le nb de coeur
            //Note Nicolas : L'user devrait spécifier un Flavor parmi ceux prédéfinis, et on récupère les caractéristiques du flavor dans la BDD.
            var container : ICreateLxcContainerRequest =
                {
                    ostemplate : 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
                    vmid : ObjectID.id,
                    password : req.body.password,
                    memory:req.body.memory
                }

            //TODO : voir plus tard le field node quand on travaillera sur ovh
            var result : IUpidReply = await proxmoxApi.createLxcContainer(proxmoxApi.node,container);
            if (result==null)
            {
                res.send({"containerID":-1,"Information":"Fail create vm"})
            }else
            {
                //db.old_ajouter_vm_a_user(req.body.login,ObjectID.id); //changer plus tard pour ajouter_vm_a_user()
                //console.log("--------- creation réussi")
                var resAdd = db.ajouter_vm_a_user(req.body.login, proxmoxApi.node, ObjectID.id, false,req.body.login+ObjectID.id.toString());
                //db.old_ajouter_vm_a_user(req.body.login,ObjectID.id); //changer plus tard pour ajouter_vm_a_user()
                console.log("------ "+resAdd);
                res.send({"containerID":ObjectID.id,"Information":"ok"});//send back vm creation information
            }


        }else
        {
            res.send({"containerID":-1,"Information":"Fail connection server"})
        }
    }
});


/* monitoring */
index.get("/monitoring/:vmid",async function(req, res, next)
{
    //connection
    var proxmoxApi : ProxmoxApiService = await ProxmoxUtils.getPromoxApi();
    if (proxmoxApi!=null)
    {
        //TODO : voir plus tard le field node quand on travaillera sur ovh
        var monitoringResult :IGetContainerStatusReply =  await proxmoxApi.getContainerStatus(proxmoxApi.node, req.params.vmid);

        if (monitoringResult==null)
        {
            res.send({"Information":"Fail get monitoring informations"});
        }else
        {
            monitoringResult["Information"]="ok";
            res.send(monitoringResult);
        }
    }else
    {
        res.send({"Information":"Fail connection server"});
    }

});


/*createBackup
 théoriquement on peu plusieurs backups, mais on va se limiter à une backup pour le projet*/
index.get("/createBackup/:id", cors(),async function(req, res, next)
{
    //connection
    var proxmoxApi : ProxmoxApiService = await ProxmoxUtils.getPromoxApi();

    if (proxmoxApi==null)
    {
        res.send({"Information":"Fail connection server"});
    }else
    {
        //TODO : voir plus tard le field node quand on travaillera sur ovh
        var createBackupResult : IUpidReply = await proxmoxApi.createContainerBackup(proxmoxApi.node, req.params.id);
        if (createBackupResult==null)
        {
            res.send({"Information":"Fail create backup"});
        }else
        {
            //sauvegarde de la backup dans la bdd
            db.associateVmBackupToAnUser(req.body.login,req.body.vmid,createBackupResult[" backup"]);
            res.send({"Information":"ok"});
        }
    }
});


/*restore backup
 TODO: vm doit être éteinte pour pouvoir faire la backup*/
index.post("/restoreBackup", async function(req, res, next)
{
    var proxmoxApi : ProxmoxApiService = await ProxmoxUtils.getPromoxApi();

    if (proxmoxApi==null)
    {
        res.send({"Information":"Fail connection server"});
    }else
    {
        var restoreLxcContainer =
            {
                vmid : 100,
                ostemplate:'/custom/backups/dump/vzdump-lxc-102-2017_01_12-22_43_28.tar.lzo'
            }
        var resHasBackup = await  db.hasBackupAssociateWithVm("coucou",130);

        if(resHasBackup)
        {
            //TODO : voir plus tard le field node quand on travaillera sur ovh
            var restoreLxcContainerResult : IUpidReply  = await  proxmoxApi.restoreLxcContainer(proxmoxApi.node, restoreLxcContainer) ;
            if (restoreLxcContainerResult!=null)
            {
                res.send({"Information":"ok"});
            }else
            {
                res.send({"Information":"Fail to restore"})
            }

        }else
        {
            res.send({"Information":"Need to have a backup if want to restore"});
        }
    }
});

index.get("/testFrameself",async function(req, res, next)
{
    var proxmoxApi : ProxmoxApiService = await ProxmoxUtils.getPromoxApi();
    var ObjectID  :IGetClusterVmNextIdReply  = await proxmoxApi.getClusterVmNextId();
    var container : ICreateLxcContainerRequest = {
        ostemplate : 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
        vmid : 100,
        password : 'tototo',
        memory:1024,
        sizeGB : 1
    };

    var result = await proxmoxApi.createLxcContainer(proxmoxApi.node, container);
    if(result == null)
        frameself.reportCreateLxcContainer(proxmoxApi.node, container);
});




/*startVM: start un container*/
index.get("/startVM/:id", cors(),async function(req, res, next)
{
    //connection
    var proxmoxApi : ProxmoxApiService = await ProxmoxUtils.getPromoxApi();

    if (proxmoxApi==null)
    {
        res.send({"Information":"Fail connection server"});
    }else
    {
        //TODO : voir plus tard le field node quand on travaillera sur ovh
        var startVMResult : IUpidReply = await proxmoxApi.startLxcContainer(proxmoxApi.node, req.params.id);
        if (startVMResult==null)
        {
            res.send({"Information":"Fail start Vm"});
        }else
        {
            res.send({"Information":"ok"});
        }
    }
});

/*stopVM: arrête un container*/
index.get("/stopVM/:id", cors(),async function(req, res, next)
{
    //connection
    var proxmoxApi : ProxmoxApiService = await ProxmoxUtils.getPromoxApi();

    if (proxmoxApi==null)
    {
        res.send({"Information":"Fail connection server"});
    }else
    {
        var stopVMResult : IUpidReply = await proxmoxApi.stopLxcContainer(proxmoxApi.node, req.params.id);
        if (stopVMResult==null)
        {
            res.send({"Information":"Fail stop Vm"});
        }else
        {
            res.send({"Information":"ok"});
        }
    }
});

export default index;