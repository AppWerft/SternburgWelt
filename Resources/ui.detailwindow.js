var createDetailWindow = function(e) {
	var style = Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL;
	var w = Ti.UI.createWindow({ 
		barColor:'#990000',
		backgroundImage:'./assets/bg.png'});
	w.addEventListener('close',function(){w=null;});	
	if (!e) {return w;}
	var imgView = Ti.UI.createImageView({
		image : e.item[0].img,
		width:310,
		borderRadius:8,
		height:240,
		top:5
	});
	var title = Ti.UI.createLabel({
		text: e.item[0].name,
		font:{fontSize:22,fontWeight:'bold'},
		height:25,
		left:5,
		top:5,
		color:'white'
	});
	
	var buba1 = Titanium.UI.createButtonBar({
		labels:['more from ' + e.von.replace(/<br \/>/g,'')],
		backgroundColor:'#332222',
		bottom:5,
		style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		height:36,
		width:300
	});
	buba1.addEventListener('click',function() {
		var aw = createArtistWindow(e.von);
		w.tab.open(aw);
	});
	address = Ti.UI.createLabel({left:10,height:20,bottom:50,text:'…',color:'#ccc',font:{fontWeight:'bold',fontSize:14}});
	w.add(buba1);
	w.add(address);
	w.title = e.item[0].name;
	w.add(imgView);
	Ti.Geolocation.reverseGeocoder(e.lng, e.lat, function(evt){
		try {
			var places = evt.places;
			address.text = places[0].city + ', ' +places[0].street  + ', ' +places[0].country_code;
		} catch(e){};
	});
	return w;
};
