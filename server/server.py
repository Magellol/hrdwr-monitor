from flask import Flask
from flask_cors import CORS, cross_origin
import psutil

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/ps")
@cross_origin()
def ps():
    return {
      "cpuPerc": psutil.cpu_percent(interval=None),
      # "avgLoad": psutil.getloadavg()
      "memoryAvailable": psutil.virtual_memory()[3],
      "memoryTotal": psutil.virtual_memory()[0],
    }