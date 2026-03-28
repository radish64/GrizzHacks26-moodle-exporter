import os
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
		password = request.form['submit-password']
		tmpfile = open(f"./tmp.{username}.json", 'w')
		scrape = subprocess.call(["node", "./example/index.js", username, password], stdout=tmpfile)

		return(f'''
			<meta http-equiv="refresh" content="0; URL=/choice/?user={username}&type=json">
			<link rel="canonical" href="/choice/?user={username}&type=json">
				''')

@app.route('/choice/')
def choice():
	username = request.args.get('user')
	filetype = request.args.get('type')
	return send_file(f"tmp.{username}.{filetype}", mimetype='text/json')

if __name__ == '__main__':
	app.run(port=5000, host="0.0.0.0")