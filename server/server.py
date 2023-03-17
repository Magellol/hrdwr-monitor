from flask import Flask
import psutil

app = Flask(__name__)

@app.route("/ps")
def ps():
    return {
      "cpuPerc": psutil.cpu_percent(interval=None),
      # "avgLoad": psutil.getloadavg()
      "memoryPerc": psutil.virtual_memory()[2]
    }