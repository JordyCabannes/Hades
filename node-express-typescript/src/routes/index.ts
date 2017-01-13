import {Router} from 'express';
import {ICreateLxcContainerRequest} from "../interfaces/create-lxc-container-request.interface";
import {ProxmoxService} from "../services/proxmox.service";
import {ProxmoxApiService} from "../services/proxmox-api.service";
import {ICreateLxcContainerReply} from "../interfaces/create-lxc-container-reply.interface";
import {IGetClusterVmNextIdReply} from "../interfaces/get-cluster-vm-next-id-reply.interface";
import {IGetContainerStatusReply} from "../interfaces/get-container-status-reply.interface";
import {DBManager}  from "../services/database/dbManager" ;

var proxApi : ProxmoxApiService = null;
async function getPromoxApi() : Promise<ProxmoxApiService> //TODO:gérer le cas où le token n'est plus valide car il a expiré
{
    if(proxApi == null)
    {
        var proxmox = new ProxmoxService('ip', '/api2/json');
        proxApi= await proxmox.connect('root@pam', 'password');
    }
    return proxApi;
}

const index = Router();

/*db Manager*/
var db= new DBManager();



 /* var proxmoxApi = getPromoxApi();
 if(proxmoxApi != null) {


 /*var cNextVmId = await proxmoxApi.getClusterVmNextId();
 var container : ICreateLxcContainerRequest = {
 ostemplate : 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
 vmid : cNextVmId.id,
 password : 'rootroot',
 memory:1024
 }*/

//var result : ICreateLxcContainerReply = await proxmoxApi.createLxcContainer('ns3060138', container);

//console.log(result);

/*var a = {
 vmid : 100,
 storage : 'backups',
 compress : BackupCompress.LZO,
 mode : BackupModes.SNAPSHOT
 }
 */
/*var d = {
 vmid : 100,
 ostemplate:'/custom/backups/dump/vzdump-lxc-102-2017_01_12-22_43_28.tar.lzo'
 }

 //var b = await proxmoxApi.createContainerBackup('ns3060138', a);
 var c = await proxmoxApi.restoreLxcContainer('ns3060138', d);
 console.log(c);
 //console.log(b);

 console.log();
 }*/


/* GET home page. */
index.get('/', function(req, res, next) {
    // ajouter_user('coucou', 'blah', UserClass.Free)
    
    db.ajouter_user("coucou", "prout", "Free");
    db.ajouter_vm_a_user('coucou', 130);
    console.log("lolilol");
});



/* post createVM */
index.post('/createVM', async function(req, res, next) 
{
    console.log("request body" + req.body);

    //connection
    var proxmoxApi : ProxmoxApiService = await getPromoxApi();

    //free or premium
    var typeUser = await db.getTypeOfUser("coucou");
    var numberVM =  await db.countUserNbVM("coucou");
    console.log(".............****************************", typeUser);
    console.log("..............********************************",numberVM);
    if (typeUser=="Free" && numberVM>0)
    {
        res.send({"containerID":-1,"information":"Cannot create more vm"})
    }else
    {
   
        if(proxmoxApi != null) 
        {
            var ObjectID  :IGetClusterVmNextIdReply  = await  proxmoxApi.getClusterVmNextId() ;

            var container : ICreateLxcContainerRequest = 
            {
                ostemplate : 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz',
                vmid : ObjectID.id,
                password : req.body.password,
                memory:req.body.memory,
            }

            
            var result : ICreateLxcContainerReply = await proxmoxApi.createLxcContainer('ns3060138',container);
            if (result==null)
            {
                res.send({"containerID":-1,"information":""})
            }else
            {
                db.ajouter_vm_a_user(req.body.login,ObjectID.id);
                res.send({"containerID":ObjectID.id,"information":""});//send back vm creation information
            }

            
        }else 
        {
             res.send({"containerID":-1})
        }
    }
});


/* monitoring */
index.get("/monitoring",async function(req, res, next) 
{
    //connection
    var proxmoxApi : ProxmoxApiService = await getPromoxApi();

    console.log("========================== vmid ",req.body.vmid);
    //voir plus tard le field node quand on travaillera sur ovh 
    var monitoringResult :IGetContainerStatusReply =  await proxmoxApi.getContainerStatus('ns3060138', req.body.vmid); 
    console.log("================================",monitoringResult);
    res.send(monitoringResult);

});


export default index;
