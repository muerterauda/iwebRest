import json

def parseJSON(headers, datasource):
    json_data = []
    for result in datasource:
        json_data.append(dict(zip(headers, result)))
    final = json.dumps(json_data)
    return final