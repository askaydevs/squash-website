import app
from waitress import serve
from paste.translogger import TransLogger
serve(TransLogger(app.app, setup_console_handler=False), port=3005, host="0.0.0.0")
