# Javascript Scalable Image Cropper

큰 사이즈의 이미지를 리사이징/크롭하기 위한 Javascript Scalable Image Cropper 입니다.

이 라이브러리는 이미지를 실제로 잘라내거나 저장하는 옵션을 제공하지는 않으며, 크롭할 좌표와 사이즈를 제공합니다.



### Import

```html
<link rel="stylesheet" href="./css/scalable-image-cropper.css">
<script src="./js/jquery-1.12.3.min.js"></script>
<script src="./js/scalable-image-cropper.js"></script>
```



### Usage

##### html

```html
  <input type="file" id="img-input">
  <div id="cropper"></div>
```

##### js

```js
$('#img-input').click(function(){
    var cropA = new Cropper('#img-input', '#cropper' ,{
        // set crop size
        cropWidth : 400,
        cropHeight: 500
    });
});
```



### Return

```js
// Type of All Values is Number
value = {
    //start Coordinate
	x1,
	y1,
    //end Coordinate
	x2,
	y2,
    //original image size
	originalWidth,
	originalHeight,
    //cropped image size
	rWidth,
	rHeight,
    //resized image size
	cropWidth,
	cropHeight
}
```

리턴된 값을 기준으로 서버에서 이미지를 잘라낼 수 있습니다.

1. 업로드된 원본 이미지를 (x1, y1) 부터 (x2, y2) 까지 잘라냅니다
2. 잘라낸 이미지를 CropWidth기준으로 정비율로 리사이징합니다.



