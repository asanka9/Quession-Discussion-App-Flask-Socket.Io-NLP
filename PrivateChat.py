from flask import Flask, render_template, request,jsonify
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey'
app.config['DEBUG'] = True
socketio = SocketIO(app)

users = {}
instrucor_users = {}
is_instructor = False

instructor_name = ''
user_name = ''

@app.route('/')
def index():
    return render_template('home.html')

## Update
@socketio.on('update_question', namespace='/private')
def update_question(payload):
    recipient_session_id = users[payload['username'].strip()]
    emit('set_header', instrucor_users[payload['instructor']][1], room=recipient_session_id)




@socketio.on('username', namespace='/private')
def receive_username(payload):
    try:
        if (users[payload['username']] or instrucor_users[payload['instructor']] ):
            emit('error_private_message', {'m': 'User name alreadyctor', 'n': 'asanka'}, room=request.sid)
    except :
        rs = request.sid
        users[payload['username']] = rs
        global instructor_name
        instructor_name = payload['instructor']
        global user_name
        user_name = payload['username']
        emit('error_private_message', '00', room=rs)
        emit('set_header', instrucor_users[payload['instructor']][1], room=rs)

@socketio.on('instructname', namespace='/private')
def receive_username(payload):
    global is_instructor
    is_instructor = True
    try:
        if (instrucor_users[payload['username']]):
            emit('error_private_message', 'User Alreadddddddddddddy Taken', room=request.sid)
    except :
        t_id = request.sid
        rs = [t_id, payload['message']]
        global user_name
        user_name = payload['username']
        instrucor_users[payload['username']] = rs
        emit('error_private_message', '00', room=t_id)
        emit('set_header', instrucor_users[payload['username']][1], room=t_id)
        print('Username added!')

@socketio.on('private_user_message', namespace='/private')
def private_message(payload):
    recipient_session_id = instrucor_users[payload['username']][0]
    message = payload['message']
    me = payload['me']
    output = {
        'me': me,
        'content': message
    }
    emit('new_private_user_message', output, room=recipient_session_id)

@socketio.on('send_instructor_reply', namespace='/private')
def private_message(payload):
    recipient_session_id = users[payload['reciever'].strip()]
    message = payload['message']
    print('This is Message : '+message)
    print('User ID : '+recipient_session_id)
    emit('new_private_instructor_message', message, room=recipient_session_id)

if __name__ == '__main__':
    socketio.run(app)