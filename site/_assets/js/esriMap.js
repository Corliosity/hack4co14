var map;
require(["esri/map", "dojo/parser", "dojo/dom-style", "esri/layers/FeatureLayer", "esri/InfoTemplate","esri/dijit/PopupTemplate","esri/symbols/PictureMarkerSymbol", "esri/geometry/Point", "esri/graphic", "esri/graphicsUtils", "esri/request", "dojo/on", "dojo/keys","dojo/dom", "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"], function(Map, parser, domStyle, FeatureLayer, InfoTemplate, PopupTemplate, PictureMarkerSymbol, Point, Graphic, GraphicsUtils, Request, on, keys, dom) {
	map = new Map("mapDiv", {
		basemap: 'topo',
		center: [-104.9847, 39.7392],
		zoom: 12
	})
	parser.parse();

  var layerURL = 'http://services3.arcgis.com/mlfj1acRX1vjytDz/arcgis/rest/services/Denver_Neighborhoods/FeatureServer/0';
  var template = new InfoTemplate('Neighborhood', '${NBHD_NAME} <br><a class="button radius small">Favorite</a>');
  var feature = new FeatureLayer(layerURL, {
    id: 'Neighborhoods',
    infoTemplate: template,
    outFields: ['NBHD_NAME']
  });

  var pedURL = 'https://services.arcgis.com/PreAgUje3h7wiyyM/arcgis/rest/services/Denver/FeatureServer/1';
  var pedTem = new InfoTemplate('Pedestrian Streets', '${*}');
  var pedFeature = new FeatureLayer(pedURL, {
    id: 'Pedestrians',
    infoTemplate: pedTem,
    outFields: ['*']
  });

  var tweetLayer = 'http://services.arcgis.com/2zRtyrQ6q4mGrLJK/ArcGIS/rest/services/Tweets_wInfo/FeatureServer/0';
  var tweetTemplate = new InfoTemplate('Tweets', '${text}');
  var tweetFeature = new FeatureLayer(tweetLayer, {
    id: 'Tweets',
    infoTemplate: tweetTemplate,
    outFields: ['userName', 'text', 'placeName']
  });

  var crimeURL = 'http://services1.arcgis.com/M8KJPUwAXP8jhtnM/arcgis/rest/services/Denver_Crimes_2008_-_2013/FeatureServer/0';
  var crimeTemplate = new InfoTemplate('Crimes:', '${*}');
  var crimeLayer = new FeatureLayer(crimeURL, {
    id: 'Crimes',
    infoTemplate: crimeTemplate,
    outFields: ['*']
  });

  var parkLayer = 'http://services3.arcgis.com/mlfj1acRX1vjytDz/arcgis/rest/services/Denver_Parks/FeatureServer/0';
  var parkTemplate = new InfoTemplate('Parks', '${*}');
  var parkFeature = new FeatureLayer(parkLayer, {
    id: 'Parks',
    infoTemplate: parkTemplate,
    outFields: ['*']
  });

  var foodURL = 'https://services.arcgis.com/PreAgUje3h7wiyyM/arcgis/rest/services/Denver/FeatureServer/0';
  var foodTemplate = new InfoTemplate('Groceries:', '${*}');
  var foodFeature = new FeatureLayer(foodURL, {
    id: 'Groceries',
    infoTemplate: foodTemplate,
    outFields: ['*']
  });

  map.addLayers([feature, tweetFeature, parkFeature, pedFeature]);
  //Look into map.on("layersAdded") event that lets it programatically to handle
  // actions between accessing and event find
  // it is common/gotcha practice
   $('#panelSelect').prepend('<a id="tweetFeature" class="button expand radius">Tweet</a><a id="neighFeature" class="button expand radius">Neighborhoods</a><a id="parkFeature" class="button expand radius">Activities</a><a id="crimeRates" class="button expand radius">Crime Rates</a><a id="foodStores" class="button expand radius">Groceries</a>');

  feature.on("click", function(event){
    map.centerAndZoom(event.mapPoint, 15);
  });

  feature.on('mouse-move', function(event) {
      console.log(event);
      feature.setOpacity(0.8)
  });

   var crimeToggle = false;

  $('#crimeRates').on('click', function(){
    if (parkToggle === true) {
      map.removeLayer(crimeLayer);
      parkToggle = false;
    } else {
      map.addLayer(crimeLayer);
      parkToggle = true;
    }
  });

    var parkToggle = true;

  $('#parkFeature').on('click', function(){
    if (parkToggle === true) {
      map.removeLayer(parkFeature);
      parkToggle = false;
    } else {
      map.addLayer(parkFeature);
      parkToggle = true;
    }
  });

  var foodToggle = false;

  $('#foodStores').on('click', function() {

    if (foodToggle === false) {
      map.addLayers([foodFeature]);
      foodToggle = true;
    } else {
      map.removeLayer(foodFeature);
      foodToggle = false;
    }

  });

	var serviceCall = function() {

        // Wire UI Events
        loadPhotos();
        // Get symbol
        var symbol = new createPictureSymbol("http://esri.github.io/quickstart-map-js/images/blue-pin.png", 0, 12, 13, 24);

        // Request to Flickr service
        function loadPhotos(){
          //clearGraphics();
          var flickrPhotos = Request({
            url: "http://api.flickr.com/services/feeds/geo",
            content:{
                format:"json",
                tagmode: "any",
                tags: ''
            },
            callbackParamName: "jsoncallback"
          });
          flickrPhotos.then(addPhotos);
        }

        // Create graphics for each Flickr item
        function addPhotos(data){
          var template = new PopupTemplate({
            title: "<b>{title}</b>",
            description:"{description}"
          });
          for (var i in data.items) {
            var item = data.items[i];
            template.setTitle(item.title);
            var loc = new Point(item.longitude, item.latitude);
            map.graphics.add(new Graphic(loc, symbol, item, template));
          }
          var extent = GraphicsUtils.graphicsExtent(map.graphics.graphics).expand(1.5);   
          //map.setExtent(extent);
        }

        function createPictureSymbol(url, xOffset, yOffset, xWidth, yHeight) {
          return new PictureMarkerSymbol(
          {
            "angle": 0,
            "xoffset": xOffset, "yoffset": yOffset, "type": "esriPMS",
            "url": url,  
            "contentType": "image/png",
            "width":xWidth, "height": yHeight
          });
        }
        function clearGraphics() {
          map.graphics.clear();
          map.infoWindow.hide();
        }
	}

	serviceCall();


})