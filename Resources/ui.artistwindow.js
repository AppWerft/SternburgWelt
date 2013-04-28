var createArtistWindow = function(artist) {
	var style = Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL;
	var w = Ti.UI.createWindow({ 
		barColor:'#990000',
		backButton :'back',
		title : artist,
		backgroundImage:'./assets/bg.png'});
	w.addEventListener('close',function(){w=null;});	
	var views = [];
	for(var i=0; i<markers.length; i++) {
		if (markers[i].von.replace(/<br \/>/,'') != artist) {continue;}
		var view = Ti.UI.createView({});
		var img = Ti.UI.createImageView({borderRadius:8,image:markers[i].item[0].img,width:310,height:240});
		view.add(img);
		var title = Ti.UI.createLabel({text:markers[i].item[0].name,textAlign:'center',bottom:5,font:{fontSize:22,fontWeight:'bold'},color:'white',height:30});
		view.add(title);
		views.push(view);
		view = null;
	}
	
	var scrollView = Ti.UI.createScrollableView({
	views:views,
	showPagingControl:true,
	pagingControlHeight:30,
	maxZoomScale:2.0,
	currentPage:0
});
	w.add(scrollView);
	
	return w;
};
