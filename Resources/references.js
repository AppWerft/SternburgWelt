if(! typeof (ctrl) == 'object') {
	var ctrl = {};
}
ctrl.references = ( function() {
	var api = {};
	api.getAll = function(url,callback) {
		var xhr = Titanium.Network.createHTTPClient({
			timeout : 15000
		});
		xhr.onload = function() {
			try {
				var data = JSON.parse(this.responseText);
				callback(data);
			} catch(e) {
				Ti.API.log(e);
			};
		};
		xhr.open('GET', url);
		xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		xhr.send();
	};
	return api;
}());

if(!typeof (view) == 'object') {
	var view = {};
}
view.references = ( function() {
	var api = {};
	api.getWindow = function() {
		var w = Ti.UI.createWindow({

		});
		w.navBarHidden = true;
		var toolbar = Ti.UI.createView({
			top : 0,
			height : 40,
			backgroundImage : Ti.Filesystem.resourcesDirectory + 'assets/start/toplogo.png'
		});
		var backbutton = Ti.UI.createImageView({
			width : 30,
			height : 30,
			left : 10,
			top : 5,
			image : Ti.Filesystem.resourcesDirectory + '/assets/backarrow.png'
		});
		backbutton.addEventListener('click', function() {
			w.close();
		});
		toolbar.add(backbutton);
		w.add(toolbar);
		w.addEventListener('close', function() {
			w = null;
		});
		var actInd = Ti.UI.createActivityIndicator({
			style : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
			message : "Get references of Rainer Schleevoigt",
			backgroundColor : '#D4A017',
			width : 290,
			height : 50,
			color : 'black',
			padding : 10,
			opacity : 0.9,
			borderRadius : 8,
			animation : true,
			font : {
				fontFamily : 'Helvetica Neue',
				fontSize : 15
			},
			animated : true
		});

		var tv = Ti.UI.createTableView({
			top : 40,
			backgroundImage : Ti.Filesystem.resourcesDirectory + 'assets/parts/bg.png',
			opacity : 0.99
		});
		tv.addEventListener('click', function(e) {
			Ti.Platform.openURL(e.rowData.appstore);
			Ti.API.log(e.rowData.appstore);
		});
		actInd.show();
		ctrl.references.getAll('http://webmasterei.com/fileadmin/references.json', function(data) {
			setTimeout(function() {
				actInd.hide();
			}, 1000);
			for(var i = 0; i < data.length; i++) {
				var item = data[i];
				var row = Ti.UI.createTableViewRow({
					hasChild : true,
					height : 'auto',
					appstore : item.link
				});
				var title = Ti.UI.createLabel({
					font : {
						fontSize : 18,
						fontWeight : 'bold'
					},
					top : 5,
					left : 80,
					height : 20,
					text : item.title
				});
				var descr = Ti.UI.createLabel({
					font : {
						fontSize : 14,
					},
					top : 25,
					left : 80,
					right : 25,
					bottom : 5,
					height : 'auto',
					text : item.descr
				});
				row.add(descr);
				var img = Ti.UI.createImageView({
					image : item.icon,
					defaultImage : 'assets/aw.png',
					width : 60,
					height : 60,
					top : 5,
					left : 5
				});
				row.add(img);
				row.add(title);
				tv.appendRow(row, {
					animationStyle : Titanium.UI.iPhone.RowAnimationStyle.LEFT,
					duration : 5000,
					delay : 1000
				});
			}
		})
		w.add(tv);
		w.add(actInd);
		return w;

	};
	return api;
}());
