from flask import Flask, request, send_from_directory,send_file,jsonify
import os
import sys
from flask_cors import CORS
import cv2
import io 



app = Flask(__name__,template_folder='template')
CORS(app)



#  route to store video and extract images 
@app.route('/', methods=['POST'])
def home():
        count = int(request.args.get('count'))
        cond = request.args.get('save')
        print(cond,file=sys.stderr)
        if 'video' in request.files:
            video_file = request.files['video']
            video_file.save("back/videos/"+video_file.filename)




            cap = cv2.VideoCapture("back/videos/"+video_file.filename)
            if not cap.isOpened():
                cap.release()
                return "Error: Invalid video file", 400
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            middle_frame_index = total_frames * count  // 5 

            cap.set(cv2.CAP_PROP_POS_FRAMES, middle_frame_index/2)
            ret, frame = cap.read()

            cap.release()

            if ret:
                 if (cond == "true"):
                    image_filename = os.path.splitext(video_file.filename)[0] + ".jpg"
                    image_path = os.path.join("back/images", image_filename)
                    cv2.imwrite(image_path, frame)
                
                 retval, buffer = cv2.imencode('.jpg', frame)
                 if retval:
                   return send_file(io.BytesIO(buffer), mimetype='image/jpeg')
            else:
                 return "error"
 
#  route to get all the image namen the folder
@app.route('/list_files')
def list_files():
    folder_path = 'back/images'  
    file_list = os.listdir(folder_path)
    return jsonify(file_list)

#  route to get individual image from the folder 
@app.route('/images/<filename>')
def get_image(filename):
    folder_path = 'images' 
    return send_from_directory(folder_path, filename)

#  route to get specific video from the folder
@app.route('/video', methods=['GET'])
def get_video():
    image_name = request.args.get('image_name')
    video_folder = 'videos' 
    video_filename = f"{image_name.split('.')[0]}.mp4"
    return send_from_directory(video_folder, video_filename, mimetype='video/mp4')



if __name__ == "__main__":
    app.run(debug=True)
