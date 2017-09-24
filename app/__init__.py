from datetime import datetime, timedelta
from threading import Lock
from flask import Flask, render_template
from flask_socketio import SocketIO
from uuid import uuid4

import time

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
thread = None
thread_lock = Lock()
async_mode = None


def background_timer():
	while True:
		time.sleep(1)
		t = str(datetime.utcnow() + timedelta(hours=5, minutes=30))
		socketio.emit('time', {'data': 'This is data',
							'time': t}, namespace='/test')


@app.route('/')
def index():
	return render_template('index.html', async_mode=socketio.async_mode)

@socketio.on('connect', namespace='/test')
def connected():
	print('Client connected')
	socketio.emit('message', {'data': 'Connected', 'count': 0})
	global thread
	with thread_lock:
		if thread is None:
			thread = socketio.start_background_task(target=background_timer)

@socketio.on('disconnect', namespace='/test')
def disconnected():
	print('Client disconnected')

@socketio.on('uuid', namespace='/test')
def send_uuid():
	socketio.emit('uuid', {'uuid': str(uuid4())}, namespace='/test')

@socketio.on('hex', namespace='/test')
def send_hex():
	socketio.emit('hex', {'hex': str(uuid4().hex)}, namespace='/test')
