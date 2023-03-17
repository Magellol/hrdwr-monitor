from flask import Flask
from flask_cors import CORS, cross_origin
import psutil

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/ps")
def ps():
    return {
      "cpuPerc": psutil.cpu_percent(interval=None),
      # "avgLoad": psutil.getloadavg()
      "memoryPerc": psutil.virtual_memory()[2]
    }