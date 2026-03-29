import os
import re
import glob
import hashlib
import subprocess
import parser
from flask import Flask, Response, request, send_file, abort, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
	return render_template('index.html')

@app.route('/login-submit/', methods=['POST', 'GET'])
def login_submit():
	if request.method == 'POST':
		username = request.form['submit-username']
		password = request.form['submit-password']
	if request.method == 'GET':
		username = request.args.get('user')
		password = request.args.get('pass')
	userhash = hashlib.sha256(b"{username}").hexdigest()
	filename = f"./{userhash}.fson"
	filename2 = f"./{userhash}.tmp.fson"
	if os.path.isfile(filename):
		tmpfile = open(filename2, 'w')
		oldfile = open(filename, 'r')
		scrape = subprocess.call(["node", "./example/index.js", username, password], stdout=tmpfile)
		oldfile.close()
		newfile = open(filename, 'w')

		diff = subprocess.run(["diff", filename, filename2], stdout=subprocess.PIPE, text=True)
		difftxt = re.sub('> ', '', diff.stdout)
		if '[' in diff.stdout:
			diffsplit = difftxt.split('\n')
			difftxt = ""
			index = 0
			for f in diffsplit:
				if index >= 1:
					difftxt += f"{f}\n"
				index += 1
			print(difftxt)
			newfile.write(difftxt)
		else:
			diffsplit = difftxt.split('\n')
			difftxt = ""
			index = 0
			for f in diffsplit:
				if index >= 2:
					difftxt += f"{f}\n"
				index += 1
			print(difftxt)
			newfile.write("[ " + difftxt + "}]")
		newfile.close()
		tmpfile.close()
		if os.path.isfile(filename2):
			os.remove(filename2)
	else:
		tmpfile = open(filename, 'w')
		scrape = subprocess.call(["node", "./example/index.js", username, password], stdout=tmpfile)
	returnjson = parser.df_to_json(filename, userhash)
	print(returnjson)
	return Resonse(returnjson, mimetype='text/json')
	#return send_file(f"{userhash}.json", mimetype='text/text')

#	return(f'''
#		<meta http-equiv="refresh" content="0; URL=/choice/?user={userhash}">
#		<link rel="canonical" href="/choice/?user={userhash}">
#			''')

@app.route('/delete/')
def delete():
	userhash = request.args.get('user')
	for f in glob.glob(f"{userhash}.*"):
		os.remove(f)
	return "deleted"

@app.route('/txt/')
def txt():
	username = request.args.get('user')
	userhash = hashlib.sha256(b"{username}").hexdigest()

	txt = parser.df_to_txt(f"{userhash}.fson", userhash)
	return Response(txt, mimetype='text/text')

@app.route('/csv/')
def csv():
	username = request.args.get('user')
	userhash = hashlib.sha256(b"{username}").hexdigest()
	csv = parser.df_to_txt(f"{userhash}.fson", userhash)
	return Response(csv, mimetype='text/csv')

@app.route('/json/')
def json():
	username = request.args.get('user')
	userhash = hashlib.sha256(b"{username}").hexdigest()
	json = parser.df_to_txt(f"{userhash}.fson", userhash)
	return Response(json, mimetype='text/json')

@app.route('/xml/')
def xml():
	username = request.args.get('user')
	userhash = hashlib.sha256(b"{username}").hexdigest()
	xml = parser.df_to_xml(f"{userhash}.fson", userhash)
	return Response(xml, mimetype='text/xml')

@app.route('/xlsx/')
def xlsx():
	username = request.args.get('user')
	userhash = hashlib.sha256(b"{username}").hexdigest()
	xlsx = parser.df_to_excel(f"{userhash}.fson", userhash)
	return Response(xlsx, mimetype='text/xlsx')

if __name__ == '__main__':
	app.run(port=5000, host="0.0.0.0")