#main parser function - parses json found in local directory and returns csv, txt, xml, and xslx
from io import StringIO

from bs4 import BeautifulSoup # might not even need actually
import pandas as pd
import re
#import json

filename = "example.json"

#opens objectarray file -> [replace example.json with other filename later] returns valid json string
def parse_to_json(filename):
    jsonstring = ""
    with open(filename, 'r') as file:
        for line in file:
            str = line
            #if(re.search("'s", line) == None): TODO: handle use case where there are 's 
            #subs all single->double quotes
            str = re.sub("\'", '\"', str)
            #replaces labels
            replacelabel = re.findall("[a-zA-Z]+:", str)
            sentencesplit = re.split("[a-zA-Z]+:", str)
            if(len(replacelabel) > 0):
                replacelabel[0] = "\"" + re.sub(":", '":', replacelabel[0])
                str = sentencesplit[0] + replacelabel[0] + sentencesplit[1]
            #replaces dates
            replacedate = re.findall("[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[.][0]{3}Z", str)
            sentencesplit = re.split("[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[.][0]{3}Z", str)
            if(len(replacedate) > 0):
                replacedate[0] = "\"" + replacedate[0] + "\""
                str = sentencesplit[0] + replacedate[0] + sentencesplit[1]
            #replaces ids
            replaceid = re.findall("\": [0-9]{8}", str)
            sentencesplit = re.split("\": [0-9]{8}", str)
            if(len(replaceid) > 0):
                replaceid[0] = re.sub("\": ", '": \"', replaceid[0]) + "\""
                if(len(sentencesplit) > 1):
                    str = sentencesplit[0] + replaceid[0] + sentencesplit[1]
                else:
                    str = sentencesplit[0] + replaceid[0]
            replaceid = re.findall("\": [0-9]{6}$", str)
            sentencesplit = re.split("\": [0-9]{6}$", str)
            if(len(replaceid) > 0):
                replaceid[0] = re.sub("\": ", '\": \"', replaceid[0]) + "\""
                if(len(sentencesplit) > 1):
                    str = sentencesplit[0] + replaceid[0] + sentencesplit[1]
                else:
                    str = sentencesplit[0] + replaceid[0]
            replaceid = re.findall("id\": [0-9]{6}", str)
            sentencesplit = re.split("id\": [0-9]{6}", str)
            if(len(replaceid) > 0):
                replaceid[0] = re.sub("\": ", '\": \"', replaceid[0]) + "\""
                if(len(sentencesplit) > 1):
                    str = sentencesplit[0] + replaceid[0] + sentencesplit[1]
                else:
                    str = sentencesplit[0] + replaceid[0]  
            #str = re.sub(r'\s', '', str) #problem child
            jsonstring += str
    file.close
    return jsonstring

#Parses through json
def parse(jsonstr):
    #breaks up objects
    jarr = jsonstr.split(']\n[')
    classobj = jarr[0] + "]"
    assignmentsobj = "[" + jarr[1]

    #pandas parses - could make more lightweight by writing my own code if this takes a while
    classdf = pd.read_json(StringIO(classobj))
    #pandas parses - could make more lightweight by writing my own code if this takes a while
    assignmentsdf = pd.read_json(StringIO(assignmentsobj))
    print(assignmentsdf.head(10))

    #parse json data, create new properly formatted json

    #parse coursename
    
    print(assignmentsdf.head(10))


    return


parse(parse_to_json(filename))