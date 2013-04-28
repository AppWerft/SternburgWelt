win1 = Titanium.UI.currentWindow;
var img = null; 
function showCamera() {
	Ti.Media.showCamera({
		showControls:true,	
		mediaTypes:Ti.Media.MEDIA_TYPE_PHOTO,
		autohide:true, 
		allowEditing:true,
		success:function(event) {
			imageView.stop();
			imageView.images = null;
			var image = event.media;
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'camera_photo.png');
			f.write(image);
			imageView.image = f.nativePath;
			imageView.borderWidth = 1;
			var data_to_send = { 
				"file": f.read(), 
				"name": 'camera_photo.png' 
			};
			xhr = Titanium.Network.createHTTPClient();
			xhr.setRequestHeader("enctype", "multipart/form-data");
			xhr.setRequestHeader("Content-Type", "image/png");
			xhr.open("POST","http://tools.webmasterei.com/sternburger/upload.php");
	  //      xhr.send(data_to_send); 
			xhr.onload = function() {
				textfield.value = this.responseText;
				Ti.API.info(this.responseText); 
			};
	 
		},
		cancel:function() { },
		error:function(error) {
			var a = Titanium.UI.createAlertDialog({title:'Camera'});
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Device does not have video recording capabilities');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			//a.show();
		}
	});

};

var topcontainer = Ti.UI.createView({height:'100%',top:5,layout:'vertical'});

var camera = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.CAMERA
});
win1.rightNavButton = camera;
var nameField = Ti.UI.createTextField({
	hintText:'Enter your name',
	height:30,
	top:5,
	left:10,
	width:300,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

var titleField = Ti.UI.createTextField({
	hintText:'Enter name of location',
	height:30,
	top:10,
	left:10,
	width:300,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

var images = [];
for (var x=0; x< 28; x++)  {images.push("/assets/rotater/" +x + ".JPG");}


topcontainer.add(nameField);
topcontainer.add(titleField);
var hint = Ti.UI.createLabel({
	text:'Click on camera takes photo, shaking starts upload',
	height:20,bottom:0,opacity:'0.7',
	color:'white',
	textAlign:'center',
	font:{fontSize:13},
	backgroundColor:'black'});

win1.add(hint);

imageView = Ti.UI.createImageView({
		image : '/assets/rotater/0.JPG',
		//duration:80, // in milliseconds, the time before next frame is shown
	    //repeatCount:3,  // 0 means animation repeats indefinitely, use > 1 to control repeat count
		borderRadius:8,
		width:310,
		height:230,
		top:10
	});
	imageView.addEventListener('load', function(e) {
	imageView.start();
	setTimeout(function(){imageView.stop();},2400);
});
	
var oldindex;	
imageView.addEventListener('singletap',showCamera);
imageView.addEventListener('touchmove',function(e) {
	var ndx = parseInt((imageView.width - e.x) / imageView.width * images.length , 10);
	if (ndx != oldindex) {
		var url = '/assets/rotater/' + ndx + '.JPG'; 
		Ti.API.log(url);
		
		imageView.image = url;
		oldindex = ndx;
	}
});;



topcontainer.add(imageView); 
win1.add(topcontainer);

var sound = Titanium.Media.createSound();
sound.url='./assets/u.mp3'; 

camera.addEventListener('click',showCamera);

Ti.Gesture.addEventListener('shake',function(e) {
		sound.play();
});



