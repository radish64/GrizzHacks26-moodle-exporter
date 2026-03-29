import os
import re
import glob
import hashlib
import subprocess
from flask import Flask, Response, request, send_file, abort, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def hello_world():
	return render_template('index.html')

@app.route('/login-submit/', methods=['POST'])
def login_submit():
	if request.method == 'POST':
		username = request.form['submit-username']
		userhash = hashlib.sha256(b"{username}").hexdigest()
		password = request.form['submit-password']
		filename = f"./{userhash}.json"
		filename2 = f"./{userhash}.tmp.json"
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
			os.remove(filename2)
		else:
			tmpfile = open(filename, 'w')
			scrape = subprocess.call(["node", "./example/index.js", username, password], stdout=tmpfile)
		return(f'''
			<meta http-equiv="refresh" content="0; URL=/choice/?user={userhash}">
			<link rel="canonical" href="/choice/?user={userhash}">
				''')

@app.route('/choice/')
def choice():
	userhash = request.args.get('user')
	return send_file(f"{userhash}.json", mimetype='text/text')

@app.route('/delete/')
def delete():
	userhash = request.args.get('user')
	for f in glob.glob(f"{userhash}.*"):
		os.remove(f)
	return "deleted"

if __name__ == '__main__':
	app.run(port=5000, host="0.0.0.0")