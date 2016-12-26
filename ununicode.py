# -*- coding: utf-8 -*-

def ununicode(data):
    """Convertit récursivement tous les strings unicodes en utf-8.
    """
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
