var Cropper = function (inputButton, frame, config) {

    var imgHeight,
        imgWidth,
        modiHeight,
        modiWidth,
        targetRect,
        resizeRate,
        cropAreaRect,
        resizeState,
        p;

    // 크롭 이미지 사이즈 지정

    var containerSize = 700;
    var cropWidth = config.cropWidth;
    var cropHeight = config.cropHeight;
    var cropRatio = cropHeight / cropWidth;

    // 이미지 축소 배율 지정
    var _URL = window.URL || window.webkitURL;

    $(inputButton).change(function (e) {
        if (!$(frame)[0].hasChildNodes()) {
            createDom(frame, setEventListner);
        }
        var image,
            file;
        if ((file = this.files[0])) {
            image = new Image();
            var input = this;
            image.onload = function () {
                imgWidth = this.width;
                imgHeight = this.height;
                resizeRate = imgWidth / containerSize;
                if (imgHeight < cropHeight || imgWidth < cropWidth) {
                    alert(
                        '이미지 사이즈가 너무 작습니다. \n' + cropWidth + 'px x ' + cropHeight +
                        "px 이상 이미지를 선택해주세요."
                    );
                    return false;
                } else {
                    readURL(input);
                }
            }
            image.src = _URL.createObjectURL(file);
        }
    });

    // dom 구성
    function createDom(frame, callback) {
        var dim = document.createElement('div');
        dim.id = 'dim';
        var wrapperCropper = document.createElement('div');
        wrapperCropper.id = 'wrapper-cropper';
        var wrapperPreview = document.createElement('div');
        wrapperPreview.id = 'wrapper-preview';
        var preview = document.createElement('img');
        preview.id = 'preview';
        preview.src = '#';
        wrapperPreview.appendChild(preview);
        var cropperOverlay = document.createElement('div');
        cropperOverlay.id = 'cropper-overlay';
        var cropArea = document.createElement('div');
        cropArea.id = 'crop-area';
        var cropAreaImage = document.createElement('img');
        cropAreaImage.id = 'crop-area-image';
        cropArea.appendChild(cropAreaImage);
        var resizeHandler = document.createElement('div');
        resizeHandler.id = 'resize-handler';
        var wrapperButton = document.createElement('div');
        wrapperButton.className = 'wrapper-button';
        var btnCancelCrop = document.createElement('button');
        btnCancelCrop.id = 'btn-cancel-crop';
        var cancelText = document.createTextNode('취소');
        btnCancelCrop.appendChild(cancelText);
        var btnSizeCal = document.createElement('button');
        btnSizeCal.id = 'btn-size-cal';
        var calText = document.createTextNode('완료');
        btnSizeCal.appendChild(calText);
        wrapperButton.appendChild(btnCancelCrop);
        wrapperButton.appendChild(btnSizeCal);

        wrapperCropper.appendChild(wrapperPreview);
        wrapperCropper.appendChild(cropperOverlay);
        wrapperCropper.appendChild(cropArea);
        wrapperCropper.appendChild(resizeHandler);
        wrapperCropper.appendChild(wrapperButton);

        var targetFrame = $(frame)[0];
        targetFrame.appendChild(dim);
        targetFrame.appendChild(wrapperCropper);
        callback();
    }

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#preview').attr('src', e.target.result);
                $('#crop-area-image').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
            setTimeout(function () {
                cropAreaRect = $('#crop-area')[0].getBoundingClientRect();
                // $('#crop-area-image')[0].style.transform = "translate(" + (0 - cropAreaRect.x
                // + targetRect.x) + "px," + (0 - cropAreaRect.y + targetRect.y) + "px)";
                $('#crop-area-image')[0].style.transform = "translate(" + 0 + "px," + 0 +
                        "px)";
            }, 50);
            // $('#preview').css({'width' : modiWidth, 'height' : modiHeight });
            targetRect = $('#preview')[0].getBoundingClientRect();
            setTimeout(function () {
                modiWidth = $('#preview')[0]
                    .getBoundingClientRect()
                    .width;
                modiHeight = $('#preview')[0]
                    .getBoundingClientRect()
                    .height;
                cropAreaRect = $('#crop-area')[0].getBoundingClientRect();
                $('#crop-area-image').css({'width': containerSize, 'height': modiHeight});
                $('#cropper-overlay').css({'width': '100%', 'height': modiHeight});
                if (cropRatio >= 1) {
                    if (modiHeight / cropRatio > modiWidth) {
                        $('#crop-area').css({
                            'width': modiWidth,
                            'height': modiWidth * cropRatio,
                            'top': 0,
                            'left': 0
                        });
                    } else {
                        $('#crop-area').css({
                            'width': modiHeight / cropRatio,
                            'height': modiHeight,
                            'top': 0,
                            'left': 0
                        });
                    }
                    // console.log('세로형크롭');
                } else {
                    if (modiWidth * cropRatio > modiHeight) {
                        $('#crop-area').css({
                            'width': modiHeight / cropRatio,
                            'height': modiHeight,
                            'top': 0,
                            'left': 0
                        });
                    } else {
                        $('#crop-area').css({
                            'width': modiWidth,
                            'height': modiWidth * cropRatio,
                            'top': 0,
                            'left': 0
                        });
                    }
                    // console.log('가로형크롭');
                }
                //
                dragElement(document.getElementById('crop-area'));
                // register resizer
                $('#resize-handler')[0].style.transform = "translate(" + (
                    parseInt($('#crop-area').css('left'), 10) + cropAreaRect.width - 6
                ) + "px," + (
                    parseInt($('#crop-area').css('top'), 10) + cropAreaRect.height - 6
                ) + "px)";
            }, 100);
        }
    }

    var resetPosition = function () {
            if (targetRect.x > cropAreaRect.x && targetRect.y > cropAreaRect.y) {
                // 좌상
                $('#crop-area').css({'left': 0, 'top': 0});
                $('#crop-area-image')[0].style.transform = "translate(0, 0)";
            } else if (targetRect.right < cropAreaRect.right && targetRect.top > cropAreaRect.top) {
                // 우상
                $('#crop-area').css({
                    'top': 0,
                    'left': targetRect.right - cropAreaRect.width - targetRect.left
                });
                $('#crop-area-image')[0].style.transform = "translate(" + (
                    0 - (targetRect.right - cropAreaRect.width - targetRect.left)
                ) + "px, 0px)";
            } else if (targetRect.left > cropAreaRect.left && targetRect.bottom < cropAreaRect.bottom) {
                // 좌하
                $('#crop-area').css({
                    'top': targetRect.bottom - cropAreaRect.height - targetRect.top,
                    'left': 0
                });
                $('#crop-area-image')[0].style.transform = "translate(0px," + (
                    0 - (targetRect.bottom - cropAreaRect.height - targetRect.top)
                ) + "px)";
            } else if (targetRect.right < cropAreaRect.right && targetRect.bottom < cropAreaRect.bottom) {
                // 우하
                $('#crop-area').css({
                    'top': targetRect.bottom - cropAreaRect.height - targetRect.top,
                    'left': targetRect.right - cropAreaRect.width - targetRect.left
                });
                $('#crop-area-image')[0].style.transform = "translate(" + (
                    0 - (targetRect.right - cropAreaRect.width - targetRect.left)
                ) + "px," + (
                    0 - (targetRect.bottom - cropAreaRect.height - targetRect.top)
                ) + "px)";
            } else if (targetRect.x > cropAreaRect.x) {
                // 좌
                $('#crop-area').css({'left': 0});
                $('#crop-area-image')[0].style.transform = "translate(0px," + (
                    0 - (cropAreaRect.top - targetRect.top)
                ) + "px)";
            } else if (targetRect.y > cropAreaRect.y) {
                // 상
                $('#crop-area').css({'top': 0});
                $('#crop-area-image')[0].style.transform = "translate(" + (
                    0 - (cropAreaRect.x - targetRect.x)
                ) + "px, 0px)";
            } else if (targetRect.right < cropAreaRect.right) {
                // 우
                $('#crop-area').css({
                    'left': targetRect.right - cropAreaRect.width - targetRect.left
                });
                $('#crop-area-image')[0].style.transform = "translate(" + (
                    0 - (targetRect.right - cropAreaRect.width - targetRect.left)
                ) + "px," + (
                    0 - (cropAreaRect.top - targetRect.top)
                ) + "px)";
            } else if (targetRect.bottom < cropAreaRect.bottom) {
                // 하
                $('#crop-area').css({
                    'top': targetRect.bottom - cropAreaRect.height - targetRect.top
                });
                $('#crop-area-image')[0].style.transform = "translate(" + (
                    0 - (cropAreaRect.left - targetRect.left)
                ) + "px," + (
                    0 - (targetRect.bottom - cropAreaRect.height - targetRect.top)
                ) + "px)";
            }
            setTimeout(function () {
                $('#resize-handler')[0].style.transform = "translate(" + (
                    parseInt($('#crop-area').css('left'), 10) + cropAreaRect.width - 6
                ) + "px," + (
                    parseInt($('#crop-area').css('top'), 10) + cropAreaRect.height - 6
                ) + "px)";
            }, 30);
        }

        function dragElement(elmnt) {
            var pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;
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
                if (resizeState) {
                    return;
                }
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                cropAreaRect = $('#crop-area')[0].getBoundingClientRect();
                targetRect = $('#preview')[0].getBoundingClientRect();
                $('#crop-area-image')[0].style.transform = "translate(" + (
                    0 - (cropAreaRect.x - targetRect.x)
                ) + "px," + (
                    0 - (cropAreaRect.y - targetRect.y)
                ) + "px)";
                $('#resize-handler')[0].style.transform = "translate(" + (
                    parseInt($('#crop-area').css('left'), 10) + cropAreaRect.width - 6
                ) + "px," + (
                    parseInt($('#crop-area').css('top'), 10) + cropAreaRect.height - 6
                ) + "px)";
            }

            function closeDragElement() {
                /* stop moving when mouse button is released:*/
                document.onmouseup = null;
                document.onmousemove = null;
                setTimeout(function () {
                    cropAreaRect = $('#crop-area')[0].getBoundingClientRect();
                    $('#crop-area-image')[0].style.transform = "translate(" + (
                        0 - cropAreaRect.x + targetRect.x
                    ) + "px," + (
                        0 - cropAreaRect.y + targetRect.y
                    ) + "px)";
                }, 10);
                resetPosition();
            }
        }

        //  element to make resizable
        var startX,
            startY,
            startWidth,
            startHeight;

        function initDrag(e) {
            resizeState = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(p).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(p).height, 10);
            document
                .documentElement
                .addEventListener('mousemove', doDrag, false);
            document
                .documentElement
                .addEventListener('mouseup', stopDrag, false);
        }

        function doDrag(e) {
            p.style.width = (startWidth + e.clientX - startX) + 'px';
            p.style.height = ((startWidth + e.clientX - startX) * cropRatio) + 'px';
            cropAreaRect = $('#crop-area')[0].getBoundingClientRect();
            $('#resize-handler')[0].style.transform = "translate(" + (
                parseInt($('#crop-area').css('left'), 10) + cropAreaRect.width - 3
            ) + "px," + (
                parseInt($('#crop-area').css('top'), 10) + cropAreaRect.height - 3
            ) + "px)";
        }

        function stopDrag(e) {
            resizeState = false;
            var condition = $('#crop-area')[0]
                .getBoundingClientRect()
                .right > $('#preview')[0]
                .getBoundingClientRect()
                .right || $('#crop-area')[0]
                .getBoundingClientRect()
                .bottom > $('#preview')[0]
                .getBoundingClientRect()
                .bottom;
            if (condition) {
                p.style.width = startWidth + 'px';
                p.style.height = startHeight + 'px';
            }
            document
                .documentElement
                .removeEventListener('mousemove', doDrag, false);
            document
                .documentElement
                .removeEventListener('mouseup', stopDrag, false);
        }

        function setEventListner() {
            $('#btn-size-cal').click(function () {
                // modifiedRate 수정 필요
                cropAreaRect = $('#crop-area')[0].getBoundingClientRect();
                targetRect = $('#preview')[0].getBoundingClientRect();
                var modifiedRate = $('#crop-area')[0]
                        .getBoundingClientRect()
                        .width / (cropWidth / resizeRate),
                    x1 = (cropAreaRect.x - targetRect.left) * resizeRate,
                    y1 = (cropAreaRect.y - targetRect.top) * resizeRate,
                    x2 = x1 + (cropWidth * modifiedRate),
                    y2 = y1 + (cropHeight * modifiedRate),
                    rWidth = x2 - x1,
                    rHeight = y2 - y1;
                var cropCoordinates = {
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    originalWidth: imgWidth,
                    originalHeight: imgHeight,
                    rWidth: rWidth,
                    rHeight: rHeight,
                    cropWidth: cropWidth,
                    cropHeight: cropHeight
                }
                console.log(cropCoordinates);
                // 완료 후 닫기
                destroyCropper();
                return cropCoordinates;
            });

            $('#btn-cancel-crop').click(function () {
                destroyCropper();
            });

            function destroyCropper() {
                var cell = $(frame)[0];
                while (cell.hasChildNodes()) {
                    cell.removeChild(cell.firstChild);
                }
            }

            p = document.getElementById('crop-area');
            $('#resize-handler').mousedown(function (e) {
                initDrag(e);
            });
        }

    };