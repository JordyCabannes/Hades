# -*- coding: utf-8 -*-

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
node = b.getClusterNodeList()['data'][0]['node'] #Récupération du nom du node ('ns____')

#Valeurs par défaut juste pour tester les fonctions
vmid = 101
interface = 'eth0'
service = 'pveproxy'
upid = 'UPID:stock:00000684:00001088:5846C0CD:startall::root@pam:'
ostemplate = 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz'
hostname='test.example.org'
password='testPassword'
description='python'

available_flavors = {
    'xsmall': {'cpus': 1,
              'memory': 512,
              'disk': 10,
              'swap': 1024},
    'small': {'cpus': 1,
              'memory': 1024,
              'disk': 15, 
              'swap': 1024},
    'medium': {'cpus': 2,
              'memory': 2048,
              'disk': 20, 
              'swap': 4096},
    'large': {'cpus': 2,
              'memory': 4096,
              'disk': 50, 
              'swap': 8192},
    'xlarge': {'cpus': 4,
              'memory': 8192,
              'disk': 100, 
              'swap': 16384}
}
flavor = available_flavors['xsmall']
available_storage_flavors = [10, 50, 100, 500, 1000]


def ok(response):
    return response['status']['ok']

def creer_container_test(flavor=flavor,
                         ostemplate=ostemplate,
                         hostname=hostname,
                         password=password,
                         description=description):

    post_data = {'ostemplate':ostemplate,
                'vmid':int(b.getClusterVmNextId()['data']),
                'description':description,
                'hostname':hostname,
                'memory':flavor['memory'],
                'password':password,
                'swap':flavor['swap']}
                #Trouver comment préciser disk, cpus

    response = b.createOpenvzContainer(node, post_data)
    if not ok(response):
        pprint(response['status'])
    print(response) #Eventuellement faire quelque chose d'utile avec les élements de la réponse
    return response


pprint(b.getClusterNodeList()['data']) #liste des nodes avec leurs nom, cpu/disk/mem et utilisation

pprint(b.getClusterLog()['data'])
pprint(b.getNodeNetworks(node)['data'])
pprint(b.getNodeInterface(node,interface)['data'])
pprint(b.getNodeContainerIndex(node)['data'])
pprint(b.getNodeVirtualIndex(node)['data'])
pprint(b.getNodeServiceList(node)['data'])
pprint(b.getNodeServiceState(node,service)['data'])
pprint(b.getNodeStorage(node)['data'])
pprint(b.getNodeFinishedTasks(node)['data'])
pprint(b.getNodeDNS(node)['data'])
pprint(b.getNodeStatus(node)['data'])
# pprint(b.getNodeSyslog(node)['data'])
pprint(b.getNodeRRD(node)) #---Manque paramètres['data']
pprint(b.getNodeRRDData(node)) #---Manque paramètres['data']
pprint(b.getNodeBeans(node)['data'])
pprint(b.getNodeTaskByUPID(node,upid)['data'])
pprint(b.getNodeTaskLogByUPID(node,upid)['data'])
pprint(b.getNodeTaskStatusByUPID(node,upid)['data'])
pprint(b.getNodeScanMethods(node)['data'])
pprint(b.getRemoteiSCSI(node)['data'])
pprint(b.getNodeLVMGroups(node)['data'])
pprint(b.getRemoteNFS(node)['data'])
pprint(b.getNodeUSB(node)['data'])
pprint(b.getClusterACL()['data'])
pprint(b.getContainerIndex(node,vmid)['data'])
pprint(b.getContainerStatus(node,vmid)['data'])
pprint(b.getContainerBeans(node,vmid)['data'])
pprint(b.getContainerConfig(node,vmid)['data'])
pprint(b.getContainerInitLog(node,vmid)['data'])
pprint(b.getContainerRRD(node,vmid)) #---Manque paramètres['data'])
pprint(b.getContainerRRDData(node,vmid)) #---Manque paramètres['data'])
pprint(b.getVirtualIndex(node,vmid)['data'])
pprint(b.getVirtualStatus(node,vmid)) #Voir l'allocation et l'utilisation des ressources en live d'une VM['data'])
pprint(b.getVirtualConfig(node,vmid,current=False)) #Autres infos sur une VM (nom, config réseau...)['data'])
pprint(b.getVirtualRRD(node,vmid)) #---Manque paramètres['data'])
pprint(b.getVirtualRRDData(node,vmid)) #---Manque paramètres['data'])
pprint(b.getStorageVolumeData(node,storage,volume)['data'])
pprint(b.getStorageConfig(storage)['data'])
pprint(b.getNodeStorageContent(node,storage)['data'])
pprint(b.getNodeStorageRRD(node,storage)) #---Manque paramètres['data'])
pprint(b.getNodeStorageRRDData(node,storage)) #---Manque paramètres['data'])
pprint(b.createOpenvzContainer(node,post_data)['data'])
pprint(b.mountOpenvzPrivate(node,vmid)['data'])
pprint(b.shutdownOpenvzContainer(node,vmid)['data'])
pprint(b.startOpenvzContainer(node,vmid)['data'])
pprint(b.stopOpenvzContainer(node,vmid)['data'])
pprint(b.unmountOpenvzPrivate(node,vmid)['data'])
pprint(b.migrateOpenvzContainer(node,vmid,target)['data'])
pprint(b.createVirtualMachine(node,post_data)['data'])
pprint(b.cloneVirtualMachine(node,vmid,post_data)['data'])
pprint(b.resetVirtualMachine(node,vmid)['data'])
pprint(b.resumeVirtualMachine(node,vmid)['data'])
pprint(b.shutdownVirtualMachine(node,vmid)['data'])
pprint(b.startVirtualMachine(node,vmid)['data'])
pprint(b.stopVirtualMachine(node,vmid)['data'])
pprint(b.suspendVirtualMachine(node,vmid)['data'])
pprint(b.migrateVirtualMachine(node,vmid,target,online=False,force=False)['data'])
pprint(b.monitorVirtualMachine(node,vmid,command)['data'])
pprint(b.vncproxyVirtualMachine(node,vmid)['data'])
pprint(b.rollbackVirtualMachine(node,vmid,snapname)['data'])
pprint(b.getSnapshotConfigVirtualMachine(node,vmid,snapname)['data'])
pprint(b.getSnapshotsVirtualMachine(node,vmid)['data'])
pprint(b.createSnapshotVirtualMachine(node,vmid,snapname,description='',vmstate=False)['data'])
pprint(b.deleteOpenvzContainer(node,vmid)['data'])
pprint(b.deleteNodeNetworkConfig(node)['data'])
pprint(b.deleteNodeInterface(node,interface)['data'])
pprint(b.deleteVirtualMachine(node,vmid)['data'])
pprint(b.deleteSnapshotVirtualMachine(node,vmid,title,force=False)['data'])
pprint(b.deletePool(poolid)['data'])
pprint(b.deleteStorageConfiguration(storageid)['data'])
pprint(b.setNodeDNSDomain(node,domain)['data'])
pprint(b.setNodeSubscriptionKey(node,key)['data'])
pprint(b.setNodeTimeZone(node,timezone)['data'])
pprint(b.setOpenvzContainerOptions(node,vmid,post_data)['data'])
pprint(b.setVirtualMachineOptions(node,vmid,post_data)['data'])
pprint(b.sendKeyEventVirtualMachine(node,vmid, key)['data'])
pprint(b.unlinkVirtualMachineDiskImage(node,vmid, post_data)['data'])
pprint(b.setPoolData(poolid, post_data)['data'])
pprint(b.updateStorageConfiguration(storageid,post_data)['data'])
