from flask import Flask, request, send_from_directory
import os
import sys
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

UPLOAD_DIRECTORY = "/path/to/the/uploads"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@app.route('/', methods=['POST'])
def home():
    if request.method == 'POST':
        if 'video' in request.files:
            video_file = request.files['video']
            video_file.save("back/"+video_file.filename)
            print(video_file,file=sys.stderr)

            return 'File uploaded successfully'
 

@app.route('/uploads/<filename>')
def upload(filename):
    return send_from_directory(UPLOAD_DIRECTORY, filename)

if __name__ == "__main__":
    app.run(debug=True)
