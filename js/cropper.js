var imgHeight,
    imgWidth,
    modiHeight,
    modiWidth,
    targetRect,
    cropAreaRect;
    
// 크롭 이미지 사이즈 지정
var cropWidth = 900;
var cropHeight = 500;

// 이미지 축소 배율 지정
var resizeRate = 3;
var defaultRate = 3;
var _URL = window.URL || window.webkitURL;

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    $('#wrapper-cropper').css({'display' : 'block'});
    $('#dim').css({'display' : 'block'});
    reader.onload = function(e) {
      $('#preview').attr('src', e.target.result);
      $('#crop-area-image').attr('src', e.target.result); 
    }
    reader.readAsDataURL(input.files[0]);
    setTimeout(function(){
      cropAreaRect = $('#crop-area')[0].getBoundingClientRect();
      $('#crop-area-image')[0].style.transform = "translate(" + (0 - cropAreaRect.x + targetRect.x) + "px," + (0 - cropAreaRect.y + targetRect.y) + "px)";
    }, 10);
    $('#preview').css({'width' : modiWidth, 'height' : modiHeight });
    targetRect = $('#preview')[0].getBoundingClientRect();
    $('#crop-area-image').css({'width' : modiWidth, 'height' : modiHeight });
    $('#cropper-overay').css({'width' : modiWidth, 'height' : modiHeight });
    $('#crop-area').css({'width': Math.round(cropWidth / resizeRate), 'height': Math.round(cropHeight / resizeRate), 'top' : 0, 'left' : 0 });
    // 
    dragElement(document.getElementById('crop-area'));
  }
}

var resetPosition = function() {
  if (targetRect.x > cropAreaRect.x && targetRect.y > cropAreaRect.y ) {
    // 좌상
    $('#crop-area').css({'left': 0, 'top': 0});
    $('#crop-area-image')[0].style.transform = "translate(0, 0)";
  } else if (targetRect.right < cropAreaRect.right && targetRect.top > cropAreaRect.top){
    // 우상
    $('#crop-area').css({'top': 0, 'left': targetRect.right - cropAreaRect.width - targetRect.left});
    $('#crop-area-image')[0].style.transform = "translate(" + (0 - (targetRect.right - cropAreaRect.width - targetRect.left)) + "px, 0px)";
  } else if (targetRect.left > cropAreaRect.left && targetRect.bottom < cropAreaRect.bottom){
    // 좌하
    $('#crop-area').css({'top': targetRect.bottom - cropAreaRect.height - targetRect.top, 'left': 0});
    $('#crop-area-image')[0].style.transform = "translate(0px," + (0 - (targetRect.bottom - cropAreaRect.height - targetRect.top)) + "px)";
  } else if (targetRect.right < cropAreaRect.right && targetRect.bottom < cropAreaRect.bottom){
    // 우하
    $('#crop-area').css({'top': targetRect.bottom - cropAreaRect.height - targetRect.top, 'left': targetRect.right - cropAreaRect.width - targetRect.left});
    $('#crop-area-image')[0].style.transform = "translate(" + (0 - (targetRect.right - cropAreaRect.width - targetRect.left)) + "px," + (0 - (targetRect.bottom - cropAreaRect.height - targetRect.top)) + "px)";
  } else if (targetRect.x > cropAreaRect.x) {
    // 좌
    $('#crop-area').css({'left': 0});
    $('#crop-area-image')[0].style.transform = "translate(0px," + (0 - (cropAreaRect.top - targetRect.top)) + "px)";
  } else if (targetRect.y > cropAreaRect.y) {
    // 상
    $('#crop-area').css({'top': 0});
    $('#crop-area-image')[0].style.transform = "translate(" + (0 - (cropAreaRect.x - targetRect.x)) + "px, 0px)";
  }  else if (targetRect.right < cropAreaRect.right ) {
    // 우
    $('#crop-area').css({'left': targetRect.right - cropAreaRect.width - targetRect.left});
    $('#crop-area-image')[0].style.transform = "translate(" + (0 - (targetRect.right - cropAreaRect.width - targetRect.left)) + "px," + (0 - (cropAreaRect.top - targetRect.top)) + "px)";
  } else if (targetRect.bottom < cropAreaRect.bottom ) {
    // 하
    $('#crop-area').css({'top': targetRect.bottom - cropAreaRect.height - targetRect.top});
    $('#crop-area-image')[0].style.transform = "translate(" + (0 - (cropAreaRect.left - targetRect.left)) + "px," + (0 - (targetRect.bottom - cropAreaRect.height - targetRect.top)) + "px)";
  } 
}

$('#img-input').change(function(e){
  var image, file;
  if ((file = this.files[0])) {
    image = new Image();
    var input = this;
    image.onload = function() {
      imgWidth = this.width;
      imgHeight = this.height;
      if (imgHeight < cropHeight || imgWidth < cropWidth ) {
        alert('이미지 사이즈가 너무 작습니다. \n' + cropWidth + 'px x ' + cropHeight + "px 이상 이미지를 선택해주세요.");
        return false;
      } else {
        modiHeight = Math.round(imgHeight / resizeRate);
        modiWidth = Math.round(imgWidth / resizeRate);
        readURL(input);
      }
    }
    image.src = _URL.createObjectURL(file);
  }
});

$('#btn-size-cal').click(function(){
  var cropCoordinates = {
    x1: (cropAreaRect.x - targetRect.left) * resizeRate,
    y1: (cropAreaRect.y - targetRect.top) * resizeRate,
    x2: (cropAreaRect.x - targetRect.left) * resizeRate + cropWidth,
    y2: (cropAreaRect.y - targetRect.top) * resizeRate + cropHeight
  }
  console.log(cropCoordinates);
  $('#wrapper-cropper').css({'display' : 'none'});
  $('#dim').css({'display' : 'none'});
});

$('#btn-cancel-crop').click(function(){
  $('#wrapper-cropper').css({'display' : 'none'});
  $('#dim').css({'display' : 'none'});
})



function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    // elmnt.style.transform = "translate(" + (elmnt.offsetLeft - pos1) + "px," + (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    cropAreaRect = $('#crop-area')[0].getBoundingClientRect();
    $('#crop-area-image')[0].style.transform = "translate(" + (0 - cropAreaRect.x + targetRect.x) + "px," + (0 - cropAreaRect.y + targetRect.y) + "px)";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    setTimeout(function(){
      cropAreaRect = $('#crop-area')[0].getBoundingClientRect();
      $('#crop-area-image')[0].style.transform = "translate(" + (0 - cropAreaRect.x + targetRect.x) + "px," + (0 - cropAreaRect.y + targetRect.y) + "px)";
    }, 10);
    resetPosition();
  }
}