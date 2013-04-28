Ti.UI.setBackgroundColor('#ff0000');
Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.OPAQUE_BLACK;

Ti.include('./ui.detailwindow.js');
Ti.include('./ui.artistwindow.js');

var actInd = Titanium.UI.createActivityIndicator({
    height:36,
    backgroundColor:'black',
    color:'white',
    opacity:0.8,
    borderRadius:5,
    width:260,
    bottom:5,
    font:{fontSize:12},
	transform : Ti.UI.create2DMatrix().rotate(-1),
    message:'Loading pins for SterniMap from net.'
});

var win1 = Titanium.UI.createWindow({  
    title:'Sterni on Tour',
    barColor:'#990000',
    backgroundImage:'./assets/bg.png'
});
var tab1 = Titanium.UI.createTab({  
    icon:'./assets/27-planet@2x.png',
    title:'SterniMap',
    window:win1
});

var win2 = Titanium.UI.createWindow({  
    title:'SterniList',
     barColor:'#990000',
    backgroundImage:'./assets/bg.png'
});
var tab2 = Titanium.UI.createTab({  
    icon:'./assets/259-list@2x.png',
    title:'SterniList',
    window:win2
});

var win3 = Titanium.UI.createWindow({  
    title:'Photographer',
     barColor:'#990000',
    backgroundImage:'./assets/bg.png'
});
var tab3 = Titanium.UI.createTab({  
    icon:'./assets/112-group@2x.png',
    title:'Photographer',
    window:win3
});

var win4 = Titanium.UI.createWindow({  
    title:'Photo upload',
    url:'cameraupload.js',
     barColor:'#990000',
    backgroundImage:'./assets/bg.png'
});
var tab4 = Titanium.UI.createTab({  
    icon:'./assets/86-camera@2x.png',
    title:'Take a photo',
    window:win4
});
var win5 = Titanium.UI.createWindow({  
    title:'Impressum',
    url:'impressum.js',
    barColor:'#990000',
    backgroundImage:'./assets/bg.png'
});
var tab5 = Titanium.UI.createTab({  
    icon:'./assets/anne.png',
    title:'Impressum',
    window:win5
});




var markers;

var listallPhotos = Ti.UI.createTableView({ width:'96%',height:'96%',borderRadius:5
});
var listallArtists = Ti.UI.createTableView({ width:'96%',height:'96%',borderRadius:5
});


listallPhotos.addEventListener('click',function(e) {
	win2.tab.open(createDetailWindow(e.rowData.entry));
});
		


var sterniMapView = Titanium.Map.createView({height:'95%',top:10,width:'98%',borderRadius:5,
	mapType: Titanium.Map.HYBRID_TYPE,
	region:{latitude: 51, longitude:13, latitudeDelta:5, longitudeDelta:5},
	animate:true
});


	
var centerB = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.STOP
	});
centerB.addEventListener('click',function(){
		try {
  			Ti.Geolocation.purpose = "Recieve User Location"; 
 			Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS; 
  			Ti.Geolocation.getCurrentPosition(function(e){
        		if (e.error) {
            		alert(e.error);
            	return;
        	} else {
            	if (e.coords.accuracy <= 5000) {
					var mylongitude = e.coords.longitude;
					var mylatitude = e.coords.latitude;
					sterniMapView.region = {
						latitude : mylatitude,
						longitude : mylongitude,
						latitudeDelta:0.1,
						longitudeDelta:0.1
					};	
					sterniMapView.userLocation = true;
					var entry_accuracy = e.coords.accuracy;
					var entry_timestamp = e.coords.timestamp;
					Ti.Geolocation.reverseGeocoder(mylatitude, mylongitude, function(evt){
						var places = evt.places;
						var entry_address = places[0].address;
					});
              }
         }
 
    });
} catch(err) {Ti.API.log(err);}
	
});

win1.rightNavButton = centerB;
	

function animateObject() {
    this.rotate = function(obj) {
        var durationAnimation = (obj.duration) ? obj.duration : 100;
        var degrees = (obj.degrees) ? obj.degrees : 180;
        var rotateMatrix = Ti.UI.create2DMatrix();
        var rotateMatrixRotation = rotateMatrix.rotate(degrees);
        var rotateAnimation = Titanium.UI.createAnimation({ transform:rotateMatrixRotation, duration:durationAnimation });
        if (obj.loop) { rotateAnimation.repeat = 2; }
        if (!obj.objects.constructor) {
            obj.anchorPoint = { x:0.5, y:0.5 };
            obj.objects.animate(rotateAnimation);
        } else {
            for (var rotateIndex=0; rotateIndex<obj.objects.length; rotateIndex++) {
                obj.objects[rotateIndex].anchorPoint = { x:0.5, y:0.5 };
                obj.objects[rotateIndex].animate(rotateAnimation);
            }
        }
    };
 
}
	

var updateMap = function() {
	
	var length = markers.length;
	var kompass = Ti.UI.createImageView({image:'/assets/kompass.png',opacity:0.6});
	var anObj = new animateObject();
	anObj.rotate({ objects:kompass,duration:6000,degrees:-180, loop:true });
	sterniMapView.add(kompass);
	setTimeout(function(){kompass.hide();},1000);
	var annotations = [];
	for(var i=0; i<length;i++) {
			var m = markers[i];
			var von = m.von.replace(/<br \/>/g,'');
			var annotation = Ti.Map.createAnnotation({
					latitude  : m.lng,
					longitude : m.lat,
					title     : m.item[0].name,
					subtitle:   m.von,
					myid      : m.id, 
					image     :'./assets/pin.png',
					animate   : true,
					rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE
			});
					
			sterniMapView.addAnnotation(annotation);
			annotation = null;
	}

	
	sterniMapView.addEventListener('click',function(e) {
		if (e.clicksource=='rightButton' || e.clicksource=='title'|| e.clicksource=='subtitle') {
			actInd.message = 'Loading of detail page…';
			actInd.show();
			actInd.bottom = 200;
			for (var i=0;i<markers.length;i++) {
				if (markers[i].id==e.annotation.myid) {
					win1.tab.open(createDetailWindow(markers[i]));
					actInd.hide();
					return;
				}
			}
		}	
	});	
};



var updateList = function() {
	var rows = [];
	var artists = {};
	var length = markers.length;

	for(var i=0; i<length;i++) {
			var m = markers[i];
			var von = m.von.replace(/<br \/>/g,'').replace(/\[F\]/g,'');
			if (isNaN(artists[von])) {
				artists[von] = 0;
			} else {
				artists[von] = artists[von]+1;
			};
			for (var item=0;item<m.item.length; item++) {
				
			//if (m.item.length<2) {continue;}
				var row = Ti.UI.createTableViewRow({height:'auto',hasChild:true,entry:m});
				var title = Ti.UI.createLabel({
					text:m.item[item].name.replace(/<br \/>/g,''),
					left:90,
					top:10,
					height:22,
					color:'#999',
					font:{
						fontSize:18,
						fontWeight:'bold'
						}
					});
				var img = Ti.UI.createImageView({left:3,top:3,bottom:3,width:80,height:80,image:m.item[item].th});
				var vonLabel = Ti.UI.createLabel({
					text:'Photo: ' + von.replace(/<br \/>/g,''),
					left:90,
					bottom:10,
					height:15,
					color:'#333',
					font:{
						fontSize:12,
						fontWeight:'bold'
						}
					});
				row.add(title);
				row.add(vonLabel);

				row.add(img);
				rows[i]=row;
			}	
	}
	listallPhotos.setData(rows);
	rows = [];
	for (var artist in artists) {
	    if (artists[artist]>2) {
	    row = Ti.UI.createTableViewRow({height:'auto',hasChild:true,artist:artist});
		title =  Ti.UI.createLabel({
			text:artist,
			left:10,
			height:36,
			opacity:'0.7', 
			color:'#666',
			font:{
				fontSize:18,
				fontWeight:'bold'
				}
			});
		row.add(title);
		rows.push(row);
		}
	}
	listallArtists.setData(rows);
	listallArtists.addEventListener('click',function(e) {
		var aw = createArtistWindow(e.rowData.artist);
		win3.tab.open(aw);
	});
};

var xhr = Titanium.Network.createHTTPClient({timeout:60000});
xhr.onload = function() {
	var json;
	try {
		json = JSON.parse(this.responseText);
		markers = json.markers;
		actInd.message= 'Got ' + markers.length + ' SterniPhotos.';
		setTimeout(function(){actInd.hide();},3000);
		updateMap();
		updateList();
	}
	 catch(e) {
	 	Ti.API.log(e);
	}
};
xhr.open('GET','http://tools.webmasterei.com/sternburger/uploads/db.json');
xhr.send();   



win1.add(sterniMapView);
win2.add(listallPhotos);
win3.add(listallArtists);



var tabGroup = Titanium.UI.createTabGroup();

tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  
tabGroup.addTab(tab3);  
tabGroup.addTab(tab4);  
tabGroup.addTab(tab5);  

tabGroup.open(1);


actInd.show();
win1.add(actInd);
