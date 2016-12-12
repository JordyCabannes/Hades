# -*- coding: utf-8 -*-

data = {'status': {'reason': 'OK', 'code': 200, 'ok': True}, u'data': [{u'name': u'ns3060138', u'level': u'', u'ip': u'213.32.27.237', u'nodeid': 0, u'local': 1, u'online': 1, u'type': u'node', u'id': u'node/ns3060138'}]}

def ununicode(data):
	if isinstance(data, dict):
		dict_ = {}
		for (k, v) in data.iteritems():
			dict_[str(k)] = ununicode(v)
		return dict_
	elif isinstance(data, list):
		list_ = []
		for el in data:
			list_.append(ununicode(el))
		return list_
	elif isinstance(data, unicode):
		return str(data)
	else:
		return data

print(ununicode(data))