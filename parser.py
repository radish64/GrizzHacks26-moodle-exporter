##############PARSER MODULE#####################
#DIRECTIONS:
#   All parsing to valid json is done within public functions.
#   Call any of the below functions with a file path string to object array file:
#       df_to_json(filpath)
#       df_to_csv(filpath)
#       df_to_txt(filpath)
#       df_to_xml(filpath)
#       df_to_excel(filpath) WIP


from io import StringIO
import pandas as pd
import re

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
            jsonstring += str
    file.close
    return jsonstring

#Parses through properly formatted json, returns dataframe
def parse_to_df(filename):
    jsonstr = parse_to_json(filename)
    #breaks up objects
    jarr = jsonstr.split(']\n[')
    classobj = jarr[0] + "]"
    assignmentsobj = "[" + jarr[1]

    classdf = pd.read_json(StringIO(classobj))
    assignmentsdf = pd.read_json(StringIO(assignmentsobj))

    #parse coursename
    #size of df is returned row*column, so dividing by num of columns
    classname_dict = {}
    numrows = int(classdf.size/3)
    for i in range(0, numrows, 1):
        str = classdf.loc[i, "name"]
        newclass = re.findall("[A-Z]{3}-[0-9]{4}", str)
        classdf.loc[i, "name"]=newclass[0]
        #add to dict
        classname_dict[int(classdf.loc[i, "id"])]=newclass[0]

    #assign coursename on assignmentsdf
    #add new col for className
    assignmentsdf.insert(loc=1, column="className", value="")
    #deleting assignments id
    assignmentsdf.drop("id", axis=1, inplace=True)
    #5 columns in df after col changes
    numrows = int(assignmentsdf.size/5)
    for i in range(0, numrows, 1):
        courseid = assignmentsdf.loc[i, "courseId"]
        #use dict for lookup
        assignmentsdf.loc[i, "className"]=classname_dict[int(courseid)]
    #deletes desc and course id column once no longer needed
    assignmentsdf.drop(columns=["courseId", "description"], inplace=True)

    #finally transforming datetime
    #pd.to_datetime(assignmentsdf["deadline"], format="%Y-%m-%dT%H:%M:%S.%fZ")
    for i in range(0, numrows, 1):
        datestr = assignmentsdf.loc[i, "deadline"]
        dt = pd.to_datetime(datestr, format="%Y-%m-%dT%H:%M:%S.%fZ")
        dtstr = dt.strftime('%Y-%m-%d %H:%M')
        assignmentsdf.loc[i, "deadline"] = dtstr
    return assignmentsdf

def df_to_json(filename):
    df = parse_to_df(filename)
    assignmentsjson = df.to_json("assignments.json" ,orient="index")
    return assignmentsjson

def df_to_csv(filename):
    df = parse_to_df(filename)
    assignmentscsv = df.to_csv("assignments.csv", columns={"className", "name", "deadline"}, index=False)
    return assignmentscsv

def df_to_txt(filename):
    df = parse_to_df(filename)
    path = r'assignments.txt'

    with open(path, 'a') as f:
        assignmentstxt = df.to_string(header=True, index=True)
        f.write(assignmentstxt)
    f.close
    return assignmentstxt

def df_to_xml(filename):
    df = parse_to_df(filename)
    assignmentsxml = df.to_xml(index=False)
    path = r'assignments.xml'

    with open(path, 'a') as f:
        assignmentsxml = df.to_string()
        f.write(assignmentsxml)
    f.close
    return assignmentsxml

# def df_to_excel(filename):
#     df = parse_to_df(filename)
#     assignmentsxlsx = df.to_excel("assignments.xlsx")
#     return assignmentsxlsx

#df_to_csv(filename)
#formattedjson = parse_to_df(filename)
# print(df_to_excel(filename))