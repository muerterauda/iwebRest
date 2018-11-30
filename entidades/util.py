import json


def parseJSON(headers, datasource):
    json_data = []
    for result in datasource:
        json_data.append(dict(zip(headers, result)))
    final = json.dumps(json_data)
    return final


def parseListDateTime(datos):
    datos = list(datos)
    datos = [list(x) for x in datos]
    for x in datos:
        x[3] = x[3].strftime("%Y-%m-%d");
        x[4] = x[4].strftime("%Y-%m-%d");
    return datos
