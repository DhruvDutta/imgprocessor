from flask import Flask,render_template,request
from PIL import Image
from io import BytesIO
import base64
import numpy as np
from ISR.models import RDN

app=Flask(__name__)

@app.route('/',methods=['GET', 'POST'])
def index():
    if request.method=='POST':
        f=request.get_data().decode('utf-8')
        response={}
        f= f.split(',')
        f=f[1]
        image=Image.open(BytesIO(base64.b64decode(f))).convert('RGB')
        lr_img = np.array(image)

        rdn = RDN(weights='psnr-small')
        sr_img = rdn.predict(lr_img)
        print(sr_img.shape)
        image = Image.fromarray(sr_img)
        image.save('./img.png')
    return render_template('./index.html')

    
if __name__ == "__main__":
    app.run(debug=True)