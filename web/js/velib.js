var icon = "http://local.webproject.com/img/velib.png";
var centreCarte = new google.maps.LatLng(48.867095, 2.322367);
var mapId = "map";
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var infowindow = null;

// fonction qui va remplacer la div de chargement des les infobulles par les information de la station de velib ( emplacements libre et disponibilité )
function afficheDataStation(station_number,data) {
	$.ajax({
		type: "GET",
		url: "http://local.webproject.com/xml/stations-velib.php?action=getInfos&station_number=" + station_number,
		dataType: "xml",
		success: function(xmlData)
		{
			$(xmlData).find('station').each(function()
            {
            	var marker = $(this); 
				var velosDispos = marker.children("available").text();
				var emplacementsDispos = marker.children("free").text();
				var html = "<p><strong>velos disponibles</strong> : "+velosDispos+"</p>";
				html += "<p><strong>emplacements libres</strong> : "+emplacementsDispos+"</p></div>";
				$("#infosStations").replaceWith(html);
				$("td#nb-selected").text(velosDispos);
				$("td#emp-selected").text(emplacementsDispos);

				// récupération des informations
				var html_name_station = $(data).html();
				var name_station = $(html_name_station+" strong").text();
				name = str_replace(" ", "", name_station);
				$("#form_nomStation").val(name_station);
				$("#form_slugNomStation").val(name);
				var lat = $("#lat-long-info").data('lat');
				var lng = $("#lat-long-info").data('long');
				$("#form_latitude").val(lat);
				$("#form_longitude").val(lng);
				$("#name_station").text(name_station);
            });
		}
	});
};

// fonction qui va charger la carte des velib
function chargeCarteVelib(map) {
	$.ajax({
		type: "GET",
		url: "http://local.webproject.com/xml/stations-velib.php",
		dataType: "xml",
		success: function(xmlData)
		{
			$(xmlData).find("marker").each(function(m) { 
				var marker = $(this); 
				var lat = marker.attr("lat"); // latitude
				var lng = marker.attr("lng"); // longitude
				var address = marker.attr("fullAddress"); // adresse complète
				var label = marker.attr("name"); // nom de la station
				var station_number = marker.attr("number"); // numéro de la station vélib
				var point = new google.maps.LatLng(lat,lng); // on créé les différents points correspondant à des stations vélib
				var html = "<div id='size'><p><strong>"+label+"</strong></p>";
				html += "<p id='lat-long-info' data-long="+lng+" data-lat="+lat+">"+address+"</p>";
				var marker2 = returnInfo(map,station_number,point,html)
				marker2.setMap(map);
			});
		}
	});
}

// fonction qui va modifier les infobulles pour tous les markers de la carte
function returnInfo(map,station_number, point, html) {
	// création du marker
	var marker = new google.maps.Marker({
		position: point,
    	title:"Velib"
	});

	var contenu = html;

	// action lors du click sur un marker
	google.maps.event.addListener(marker, 'click', function() {
		if (!infowindow) {
			// création de l'infobulle
            infowindow = new google.maps.InfoWindow();
            // on remplie l'infobulle
            infowindow.setContent(contenu +'<div id=\"infosStations\" /><p class="loader"><img src=\"http://local.webproject.com/img/load.gif\" alt="chargement en cours..." /></p></div>');
            // on remplace le loader par les bonnes infos
            afficheDataStation(station_number, html);
            // on ouvre l'infobulle
            infowindow.open(map,marker);
            // on centre la map sur le marker
            map.panTo(point);
          } else {
            infowindow.setContent(contenu +'<div id=\"infosStations\" /><p class="loader"><img src=\"http://local.webproject.com/img/load.gif\" alt="chargement en cours..." /></p></div>');
            // on remplace le loader par les bonnes infos
            afficheDataStation(station_number, html);
            // on ouvre l'infobulle
            infowindow.open(map,marker);
            // on centre la map sur le marker
            map.panTo(point);
          }
	});
	return marker;
}

function calcRoute() {
	var start = $('#start').val();
	var end = $('#end').val();
	  var request = {
	    origin:start,
	    destination:end,
	    travelMode: google.maps.TravelMode.DRIVING
	  };
	  directionsService.route(request, function(result, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(result);
	    }
	  });

	directionsDisplay = new google.maps.DirectionsRenderer();

	// définition du calque qui accueillera la carte
	var mapOptions = {
          center: centreCarte,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    // création de la carte google map
    map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
	
	chargeCarteVelib(map); // on charge la carte vélib

	directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('route'));
}

$(document).ready(function(){
	// définition du calque qui accueillera la carte
	var mapOptions = {
          center: centreCarte,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.BICYCLING
        };
    // création de la carte google map
    map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
	
	chargeCarteVelib(map); // on charge la carte vélib

});

/*function traceRoute(map){
	var start = $('#start').val();
	var end = $('#end').val();

	var map = new GMap2(document.getElementById(mapId));

	// Centrage de la carte
	map.setCenter(centreCarte, 15);

	// Ajoute des controles de base de la Google Map
	map.addControl(new GSmallMapControl());

	// Ajoute le type de carte "Relief"
	map.addMapType(G_PHYSICAL_MAP);

	// pour pouvoir scroller avec la souris sur la map
	map.enableScrollWheelZoom();

	directionsPanel = document.getElementById("route");
  	directions = new GDirections(map, directionsPanel);
  	directions.load("from: "+ start +" to: "+ end +"");

	// Créé une hiérarchie dans les différents type de carte
	var hierarchy = new GHierarchicalMapTypeControl();

	// Insère dans la carte satellite des données supplémentaires
	hierarchy.addRelationship(G_SATELLITE_MAP, G_HYBRID_MAP, null, true);

	// Ajoute le controle "hierarchie"
	map.addControl(hierarchy);
	
	chargeCarteVelib(map); // on charge la carte vélib
	ajoutInfos(map); // on ajoute les fonctionnalités supplémentaires
 
}*/
