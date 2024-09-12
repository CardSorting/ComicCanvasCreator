from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file uploaded'}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if image:
        filename = image.filename
        image.save(os.path.join('static', 'uploads', filename))
        return jsonify({'success': True, 'filename': filename}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
