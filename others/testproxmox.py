# -*- coding: utf-8 -*-

from pyproxmox import *
from pprint import pprint
import configparser


#Valeurs par défaut juste pour tester les fonctions
vmid = 101
interface = 'eth0'
service = 'pveproxy'
upid = 'UPID:stock:00000684:00001088:5846C0CD:startall::root@pam:'
ostemplate = 'local:vztmpl/debian-8.0-standard_8.4-1_amd64.tar.gz'
hostname='test.example.org'
password='testPassword'
description='python'

available_flavors = { #Ou mettre ça dans un INI
    'xsmall': {'cpus': 1,
              'memory': 512,
              'disk': 10,
              'swap': 1024},
    'small':  {'cpus': 1,
              'memory': 1024,
              'disk': 15, 
              'swap': 1024},
    'medium': {'cpus': 2,
              'memory': 2048,
              'disk': 20, 
              'swap': 4096},
    'large':  {'cpus': 2,
              'memory': 4096,
              'disk': 50, 
              'swap': 8192},
    'xlarge': {'cpus': 4,
              'memory': 8192,
              'disk': 100, 
              'swap': 16384}}
flavor = available_flavors['xsmall'] #juste un flavor par défaut pour tester
available_shared_storage_sizes = [10, 50, 100, 500, 1000]


def ok(response):
    return response['status']['ok']

def init(local=False):
    """Initialise les clients proxmox pour chaque node (à partir du fichier INI)"""
    global b #Node par défaut, pratique pour faire des tests
    global nodes

    def read_nodes_fichier_ini():
        config = configparser.SafeConfigParser()
        try:
            config.read('proxmoxnodes.ini')
            nodes = {}
            for node in [s for s in config.sections() if s.startswith('Local' if local else 'Serveur')]:
                nodes[node] = dict(config[node])
            return nodes
        except:
            input('ERREUR: Le fichier INI est mal formé ou inexistant.')
            raise

    def initialiser_clients_nodes(credentials_list):
        def _initialiser_clients_nodes(credentials_list):
            for node_name, node_creds in credentials_list.iteritems():
                a = prox_auth(node_creds['ip'], node_creds['login']+'@pam', node_creds['pass'])
                yield pyproxmox(a)
        return list(_initialiser_clients_nodes(credentials_list))

    def add_node_attributes(node):
        """Ajoute les attributs name et ip au node (on en a souvent besoin pour appeler les fonctions de l'API)"""
        node_info = node.getClusterStatus()['data'][0]
        node.name = node_info['name']
        node.ip = node_info['ip']
        return node

    #En fait ce sont des serveurs proxmox que l'on manipule.
    #Dans notre cas, on n'a qu'un node par serveur, donc on peut considérer que serveur == node.
    nodes = initialiser_clients_nodes(read_nodes_fichier_ini())
    nodes = map(add_node_attributes, nodes)
    b = nodes[0] 


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

    response = b.createOpenvzContainer(b.name, post_data)
    if not ok(response):
        pprint(response['status'])
    print(response) #Eventuellement faire quelque chose d'utile avec les élements de la réponse
    return response

def liste_tout_dans_node(node):
    """Liste toutes les VMs et containers d'un certain b."""
    # Attributs spécifiques à 'containers' et 'vms':
    # container : pid 
    # virtual : lock, maxswap, swap, type
    liste_containers = node.getNodeContainerIndex(node.name)['data']
    liste_vms = node.getNodeVirtualIndex(node.name)['data']
    return dict(containers=liste_containers, vms=liste_vms)

def liste_tout():
    """Liste toutes les VMs et containers sur tous les nodes."""
    result = liste_tout_dans_node(nodes[0])
    for node in nodes[1:]:
        for k in result.keys():
            result[k].extend(liste_tout_dans_node(node)[k])
    return result

def liste_vms_user(user):
    #Pas encore possible, il faudra surement checker dans la BDD
    return [vm for vm in liste_tout() if vm['user'] == user]
    raise NotImplementedError

def creer_vm():
    pprint(b.createVirtualMachine(b.name,post_data)['data'])
    pprint(b.startVirtualMachine(b.name,vmid)['data'])
    # raise NotImplementedError

def cloner_vm():
    pprint(b.cloneVirtualMachine(b.name,vmid,post_data)['data'])
    # raise NotImplementedError

def tuer_vm():
    pprint(b.deleteVirtualMachine(b.name,vmid)['data'])
    # raise NotImplementedError

def migrer_vm():
    pprint(b.migrateVirtualMachine(b.name,vmid,target,online=False,force=False)['data'])
    # raise NotImplementedError

def resize_vm():
    pprint(b.setVirtualMachineOptions(b.name,vmid,post_data)['data'])
    # raise NotImplementedError

def relever_metriques_vm():
    pprint(b.getVirtualStatus(b.name,vmid))
    # raise NotImplementedError

def relever_metriques_node():
    pprint(b.getNodeStatus(b.name)['data'])
    # raise NotImplementedError

def calculer_montant_facturation_vm():
    #Regarder le flavor de la vm (à chaque flavor correspond un coefficient multiplicateur de prix)
    #Regarder le taux d'utilisation moyen des ressources et le temps ou un truc dans le genre
    #multiplier par le prix de base par minute ou seconde
    raise NotImplementedError

def calculer_montant_facturation_user(user):
    user_vms = liste_vms_user(user)
    billing_per_vm = map(calculer_montant_facturation_vm, user_vms)
    return sum(billing_per_vm)

def creer_stockage_partage():
    raise NotImplementedError

def creer_reseau_virtuel():
    raise NotImplementedError

def ajouter_vm_au_reseau_virtuel():
    raise NotImplementedError



init(local=False)


'''
pprint(b.getClusterNodeList()['data']) #liste des nodes avec leurs nom, cpu/disk/mem et utilisation
pprint(b.getClusterLog()['data'])

pprint(b.getNodeContainerIndex(b.name)['data'])
pprint(b.getNodeVirtualIndex(b.name)['data'])

pprint(b.getNodeNetworks(b.name)['data'])
pprint(b.getNodeInterface(b.name,interface)['data'])
pprint(b.deleteNodeInterface(b.name,interface)['data'])
pprint(b.getNodeScanMethods(b.name)['data'])
pprint(b.deleteNodeNetworkConfig(b.name)['data'])
pprint(b.setNodeDNSDomain(b.name,domain)['data'])
pprint(b.getNodeServiceList(b.name)['data'])
pprint(b.getNodeServiceState(b.name,service)['data'])
pprint(b.getNodeStorage(b.name)['data'])
pprint(b.getNodeFinishedTasks(b.name)['data'])
pprint(b.getNodeDNS(b.name)['data'])
pprint(b.getNodeStatus(b.name)['data'])
pprint(b.getNodeSyslog(b.name)['data'])

pprint(b.getNodeRRD(b.name)) #---Manque paramètres['data']
pprint(b.getNodeRRDData(b.name)) #---Manque paramètres['data']
pprint(b.getNodeBeans(b.name)['data'])
pprint(b.getNodeTaskByUPID(b.name,upid)['data'])
pprint(b.getNodeTaskLogByUPID(b.name,upid)['data'])
pprint(b.getNodeTaskStatusByUPID(b.name,upid)['data'])
pprint(b.setNodeSubscriptionKey(b.name,key)['data'])
pprint(b.setNodeTimeZone(b.name,timezone)['data'])

pprint(b.deletePool(poolid)['data'])
pprint(b.setPoolData(poolid, post_data)['data'])

pprint(b.getRemoteiSCSI(b.name)['data'])
pprint(b.getNodeLVMGroups(b.name)['data'])
pprint(b.getRemoteNFS(b.name)['data'])
pprint(b.getNodeUSB(b.name)['data'])
pprint(b.getClusterACL()['data'])

pprint(b.getContainerIndex(b.name,vmid)['data'])
pprint(b.getContainerStatus(b.name,vmid)['data'])
pprint(b.getContainerBeans(b.name,vmid)['data'])
pprint(b.getContainerConfig(b.name,vmid)['data'])
pprint(b.getContainerInitLog(b.name,vmid)['data'])
pprint(b.getContainerRRD(b.name,vmid)) #---Manque paramètres['data'])
pprint(b.getContainerRRDData(b.name,vmid)) #---Manque paramètres['data'])

pprint(b.getVirtualIndex(b.name,vmid)['data'])
pprint(b.getVirtualStatus(b.name,vmid)) #Voir l'allocation et l'utilisation des ressources en live d'une VM['data'])
pprint(b.getVirtualConfig(b.name,vmid,current=False)) #Autres infos sur une VM (nom, config réseau...)['data'])
pprint(b.getVirtualRRD(b.name,vmid)) #---Manque paramètres['data'])
pprint(b.getVirtualRRDData(b.name,vmid)) #---Manque paramètres['data'])

pprint(b.getStorageVolumeData(b.name,storage,volume)['data'])
pprint(b.getStorageConfig(storage)['data'])
pprint(b.deleteStorageConfiguration(storageid)['data'])
pprint(b.updateStorageConfiguration(storageid,post_data)['data'])
pprint(b.getNodeStorageContent(b.name,storage)['data'])
pprint(b.getNodeStorageRRD(b.name,storage)) #---Manque paramètres['data'])
pprint(b.getNodeStorageRRDData(b.name,storage)) #---Manque paramètres['data'])

pprint(b.createOpenvzContainer(b.name,post_data)['data'])
pprint(b.mountOpenvzPrivate(b.name,vmid)['data'])
pprint(b.shutdownOpenvzContainer(b.name,vmid)['data'])
pprint(b.startOpenvzContainer(b.name,vmid)['data'])
pprint(b.stopOpenvzContainer(b.name,vmid)['data'])
pprint(b.unmountOpenvzPrivate(b.name,vmid)['data'])
pprint(b.migrateOpenvzContainer(b.name,vmid,target)['data'])
pprint(b.deleteOpenvzContainer(b.name,vmid)['data'])
pprint(b.setOpenvzContainerOptions(b.name,vmid,post_data)['data'])

pprint(b.createVirtualMachine(b.name,post_data)['data'])
pprint(b.cloneVirtualMachine(b.name,vmid,post_data)['data'])
pprint(b.resetVirtualMachine(b.name,vmid)['data'])
pprint(b.resumeVirtualMachine(b.name,vmid)['data'])
pprint(b.shutdownVirtualMachine(b.name,vmid)['data'])
pprint(b.startVirtualMachine(b.name,vmid)['data'])
pprint(b.stopVirtualMachine(b.name,vmid)['data'])
pprint(b.suspendVirtualMachine(b.name,vmid)['data'])
pprint(b.migrateVirtualMachine(b.name,vmid,target,online=False,force=False)['data'])
pprint(b.monitorVirtualMachine(b.name,vmid,command)['data'])
pprint(b.vncproxyVirtualMachine(b.name,vmid)['data'])
pprint(b.rollbackVirtualMachine(b.name,vmid,snapname)['data'])
pprint(b.deleteVirtualMachine(b.name,vmid)['data'])
pprint(b.setVirtualMachineOptions(b.name,vmid,post_data)['data'])
pprint(b.sendKeyEventVirtualMachine(b.name,vmid, key)['data'])
pprint(b.unlinkVirtualMachineDiskImage(b.name,vmid, post_data)['data'])

pprint(b.getSnapshotConfigVirtualMachine(b.name,vmid,snapname)['data'])
pprint(b.getSnapshotsVirtualMachine(b.name,vmid)['data'])
pprint(b.createSnapshotVirtualMachine(b.name,vmid,snapname,description='',vmstate=False)['data'])
pprint(b.deleteSnapshotVirtualMachine(b.name,vmid,title,force=False)['data'])
'''
