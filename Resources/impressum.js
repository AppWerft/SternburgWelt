win1 = Titanium.UI.currentWindow;

var video = Ti.Media.createVideoPlayer({width:320,height:240});

video.url = '/assets/spiderpudel.mp4';

win1.add(video);