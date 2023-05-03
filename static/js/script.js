window.onload=function(){
    let canvas = document.getElementById('myCanvas')
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.height=h*0.75;
    canvas.width=w*0.75;
}

function draw(img){
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    ratio=img.height/img.width;
    c_ratio=canvas.height/canvas.width;
    if(ratio>c_ratio){
        img.height=canvas.height;
        img.width=img.height/ratio;
    }else{
        img.width=canvas.width;
        img.height=img.width*ratio;
    }
    canvas.width=img.width;
    context.drawImage(img, 0, 0, img.width,img.height);
}

var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

let img;
function handleImage(e){
    console.log('handle image')
    var reader = new FileReader();
    reader.onload = function(event){
        img = new Image();
        img.onload = function(){
            draw(img)
            var upload = document.getElementById('upload');
            upload.remove()
        }
        
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

function superres(){
    let canvas = document.getElementById('myCanvas')
    $.ajax({
        type:'POST',
        data:canvas.toDataURL(),
        success:function(){
            console.log('data sent')
        }
    })
}




function invert(){
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255 - imgData.data[i];
        imgData.data[i+1] = 255 - imgData.data[i+1];
        imgData.data[i+2] = 255 - imgData.data[i+2];
        imgData.data[i+3] = 255;
    }
    context.putImageData(imgData, 0, 0);
    //document.getElementById("myCanvas").innerHTML=imgData.data.toString();
}
function brightness(x){
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for(let i=0;i<imageData.data.length;i++){

        imageData.data[i]=imageData.data[i]+x;
        
        if(imageData.data[i]<0){
            imageData.data[i]=0;
        }
        if(imageData.data[i]>255){
            imageData.data[i]=255;
        }
    }
    context.putImageData(imageData, 0, 0);
}

function hflip(){
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    ctx.translate(img.width,0);
    ctx.scale(-1,1);
    ctx.drawImage(img, 0, 0, img.width,img.height);
}

function vflip(){
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    ctx.translate(0,img.height);
    ctx.scale(1,-1);
    ctx.drawImage(img, 0, 0, img.width,img.height);
}
function crop() {
    var canvas = document.getElementById('myCanvas');
    var pos = canvas.getBoundingClientRect();
    var rect = document.createElement('div');
    rect.className = 'crop-rect';
    rect.setAttribute('style', `height:${canvas.height}px;width:${canvas.width}px;`)
    document.getElementsByClassName('main')[0].appendChild(rect);
    document.getElementById('controls').classList.add('invisible');
    document.getElementById('more').classList.add('d-flex');
    document.getElementById('more').innerHTML = '<div class="btn btn-danger" onclick="crop_cancel()"><i class="bi bi-x-lg"></i></div><div class="btn btn-info">Done</div>'
    var isMouseDown = false;
    var mouseX = 0;
    var mouseY = 0;

    rect.addEventListener("mousedown", function(e) {
        isMouseDown = true;
        mouseX = e.clientX - rect.offsetLeft;
        mouseY = e.clientY - rect.offsetTop;
    });

    rect.addEventListener("mouseup", function() {
        isMouseDown = false;
    });

    rect.addEventListener("mousemove", function(e) {
        if (isMouseDown) {
            rect.style.left = e.clientX - mouseX + "px";
            rect.style.top = e.clientY - mouseY + "px";
        }
    });
    
}


function crop_cancel(){
    document.getElementsByClassName('crop-rect')[0].remove();
    document.getElementById('controls').classList.remove('invisible');
    document.getElementById('more').classList.remove('d-flex');
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
