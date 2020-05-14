from flask import Flask
app = Flask(__name__)

@app.route('/')
def index():
    return open("heads/webgl.html").read()

@app.route('/webgl.css')
def style():
    return open("heads/webgl.css").read()

@app.route('/webgl.js')
def js():
    return open("heads/webgl.js").read()


app.run(host='0.0.0.0', port='8080')
