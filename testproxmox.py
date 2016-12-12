from pyproxmox import *
from pprint import pprint
#Disable warnings
import requests
# from requests.packages.urllib3.exceptions import InsecureRequestWarning
# requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# a = prox_auth('127.0.0.1','root@pam','proxmox') #local
# b = pyproxmox(a)
a = prox_auth('213.32.27.237','root@pam','N4rmwE3JeztE') #Node name: ''
b = pyproxmox(a)

status = b.getClusterStatus()
print(status)

print("\n\n\nHello!\n\n\n")

def creer_container_test():

    post_data = {'ostemplate':'local:vztmpl/debian-7.0-standard_7.0-2_i386.tar.gz',
                'vmid':'9004','cpus':'4','description':'test container',
                'disk':'10','hostname':'test.example.org','memory':'1024',
                'password':'testPassword','swap':'1024'}

    returndata = b.createOpenvzContainer('pve', post_data)
    if returndata['data'] is None:
        print('Erreur lors de la création du container !')
        #Vérifier que le container dont postdata['vmid'] existe
        
        
    else:
        print('all good !')
    print(returndata)

node = 'ns3060138'
vmid = 101

# pve_networkdata = b.getNodeNetworks('ns3060138')['data']
# pprint(pve_networkdata)
# node_container_index = b.getNodeContainerIndex('ns3060138')['data']
# pprint(node_container_index)

pprint(b.getClusterStatus())
'''
[{u'id': u'node/ns3060138',
  u'ip': u'213.32.27.237',
  u'level': u'',
  u'local': 1,
  u'name': u'ns3060138',
  u'nodeid': 0,
  u'online': 1,
  u'type': u'node'}]
'''
node = str(b.getClusterStatus()['data'][0]['name']) #nom du seul node

pprint(b.getClusterVmNextId())
pprint(b.getClusterNodeList())
pprint(b.getClusterLog())
pprint(b.getNodeNetworks(node))
pprint(b.getNodeInterface(node,interface))
pprint(b.getNodeContainerIndex(node))
pprint(b.getNodeVirtualIndex(node))
pprint(b.getNodeServiceList(node))
pprint(b.getNodeServiceState(node,service))
pprint(b.getNodeStorage(node))
pprint(b.getNodeFinishedTasks(node))
pprint(b.getNodeDNS(node))
pprint(b.getNodeStatus(node))
pprint(b.getNodeSyslog(node))
pprint(b.getNodeRRD(node) #---Manque paramètres)
pprint(b.getNodeRRDData(node) #---Manque paramètres)
pprint(b.getNodeBeans(node))
pprint(b.getNodeTaskByUPID(node,upid))
pprint(b.getNodeTaskLogByUPID(node,upid))
pprint(b.getNodeTaskStatusByUPID(node,upid))
pprint(b.getNodeScanMethods(node))
pprint(b.getRemoteiSCSI(node))
pprint(b.getNodeLVMGroups(node))
pprint(b.getRemoteNFS(node))
pprint(b.getNodeUSB(node))
pprint(b.getClusterACL())
pprint(b.getContainerIndex(node,vmid))
pprint(b.getContainerStatus(node,vmid))
pprint(b.getContainerBeans(node,vmid))
pprint(b.getContainerConfig(node,vmid))
pprint(b.getContainerInitLog(node,vmid))
pprint(b.getContainerRRD(node,vmid) #---Manque paramètres)
pprint(b.getContainerRRDData(node,vmid) #---Manque paramètres)
pprint(b.getVirtualIndex(node,vmid))
pprint(b.getVirtualStatus(node,vmid) #Voir l'allocation et l'utilisation des ressources en live d'une VM)
pprint(b.getVirtualConfig(node,vmid,current=False) #Autres infos sur une VM (nom, config réseau...))
pprint(b.getVirtualRRD(node,vmid) #---Manque paramètres)
pprint(b.getVirtualRRDData(node,vmid) #---Manque paramètres)
pprint(b.getStorageVolumeData(node,storage,volume))
pprint(b.getStorageConfig(storage))
pprint(b.getNodeStorageContent(node,storage))
pprint(b.getNodeStorageRRD(node,storage) #---Manque paramètres)
pprint(b.getNodeStorageRRDData(node,storage) #---Manque paramètres)
pprint(b.createOpenvzContainer(node,post_data))
pprint(b.mountOpenvzPrivate(node,vmid))
pprint(b.shutdownOpenvzContainer(node,vmid))
pprint(b.startOpenvzContainer(node,vmid))
pprint(b.stopOpenvzContainer(node,vmid))
pprint(b.unmountOpenvzPrivate(node,vmid))
pprint(b.migrateOpenvzContainer(node,vmid,target))
pprint(b.createVirtualMachine(node,post_data))
pprint(b.cloneVirtualMachine(node,vmid,post_data))
pprint(b.resetVirtualMachine(node,vmid))
pprint(b.resumeVirtualMachine(node,vmid))
pprint(b.shutdownVirtualMachine(node,vmid))
pprint(b.startVirtualMachine(node,vmid))
pprint(b.stopVirtualMachine(node,vmid))
pprint(b.suspendVirtualMachine(node,vmid))
pprint(b.migrateVirtualMachine(node,vmid,target,online=False,force=False))
pprint(b.monitorVirtualMachine(node,vmid,command))
pprint(b.vncproxyVirtualMachine(node,vmid))
pprint(b.rollbackVirtualMachine(node,vmid,snapname))
pprint(b.getSnapshotConfigVirtualMachine(node,vmid,snapname))
pprint(b.getSnapshotsVirtualMachine(node,vmid))
pprint(b.createSnapshotVirtualMachine(node,vmid,snapname,description='',vmstate=False))
pprint(b.deleteOpenvzContainer(node,vmid))
pprint(b.deleteNodeNetworkConfig(node))
pprint(b.deleteNodeInterface(node,interface))
pprint(b.deleteVirtualMachine(node,vmid))
pprint(b.deleteSnapshotVirtualMachine(node,vmid,title,force=False))
pprint(b.deletePool(poolid))
pprint(b.deleteStorageConfiguration(storageid))
pprint(b.setNodeDNSDomain(node,domain))
pprint(b.setNodeSubscriptionKey(node,key))
pprint(b.setNodeTimeZone(node,timezone))
pprint(b.setOpenvzContainerOptions(node,vmid,post_data))
pprint(b.setVirtualMachineOptions(node,vmid,post_data))
pprint(b.sendKeyEventVirtualMachine(node,vmid, key))
pprint(b.unlinkVirtualMachineDiskImage(node,vmid, post_data))
pprint(b.setPoolData(poolid, post_data))
pprint(b.updateStorageConfiguration(storageid,post_data)b.pprint()