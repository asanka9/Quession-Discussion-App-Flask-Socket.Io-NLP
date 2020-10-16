from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey'
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class UserModel(db.Model):
    pass

socketio = SocketIO(app)