from flask import Flask
import psutil

app = Flask(__name__)

@app.route("/ps")
def ps():
    return {
        "perc": psutil.cpu_percent(interval=1.0)
    }
