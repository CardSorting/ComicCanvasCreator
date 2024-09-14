from flask import Flask, render_template, request, jsonify, send_file
import os
from io import BytesIO
from reportlab.pdfgen import canvas
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF

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

@app.route('/export', methods=['POST'])
def export_comic():
    data = request.json
    format = data.get('format', 'pdf')
    comic_data = data.get('comicData', '')

    if format == 'pdf':
        buffer = BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(100, 100, "Comic Strip")
        # TODO: Implement actual comic rendering logic
        p.showPage()
        p.save()
        buffer.seek(0)
        return send_file(buffer, as_attachment=True, download_name="comic.pdf", mimetype='application/pdf')
    elif format == 'svg':
        # TODO: Implement SVG generation logic
        svg_content = f'<svg xmlns="http://www.w3.org/2000/svg"><text x="10" y="20">{comic_data}</text></svg>'
        return send_file(BytesIO(svg_content.encode()), as_attachment=True, download_name="comic.svg", mimetype='image/svg+xml')
    else:
        return jsonify({'error': 'Unsupported format'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
