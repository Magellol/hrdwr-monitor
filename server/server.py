from flask import Flask
from flask_cors import cross_origin
import psutil

app = Flask(__name__)

@app.route("/ps")
@cross_origin()
def ps():
    return {
      "cpuPerc": psutil.cpu_percent(interval=None),
      # "avgLoad": psutil.getloadavg()
      "memoryAvailable": psutil.virtual_memory()[3],
      "memoryTotal": psutil.virtual_memory()[0],
    }