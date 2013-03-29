var icon = "http://local.webproject.com/img/velib.png";
var centreCarte = new google.maps.LatLng(48.867095, 2.322367);
var mapId = "map";
var directionsPanel;
var directions;

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
				var html = "<div><p><strong>"+label+"</strong></p>";
				html += "<p id='lat-long-info' data-long="+lng+" data-lat="+lat+">"+address+"</p>";
				var marker2 = returnInfo(station_number,point,html)
				marker2.setMap(map);
			});
		}
	});
}

function returnInfo(station_number, point, html) {
	var marker = new google.maps.Marker({
		position: point,
    	title:"Hello World!"
	});

	var infoWindow = new google.maps.InfoWindow();

	google.maps.event.addListener(marker, 'click', function() {
  		infoWindow.setContent(html +'<div id=\"infosStations\" /><p class="loader"><img src=\"http://local.webproject.com/img/load.gif\" alt="chargement en cours..." /></p></div>');
		afficheDataStation(station_number, html);
		infoWindow.open(map,marker);
	});
	return marker;
}

$(document).ready(function(){
	// définition du calque qui accueillera la carte
	var mapOptions = {
          center: centreCarte,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
	
	chargeCarteVelib(map); // on charge la carte vélib
});

// variable pour la direction
/*var directionsPanel;
var directions;*/

// positionne le focus de la carte
//var centreCarte = new GLatLng(48.867095, 2.322367);

// Personnalisation de l'icone du velib 
/*var icon = new GIcon();
icon.image = "http://local.webproject.com/img/velib.png";
icon.iconSize = new GSize(12, 20);
icon.shadowSize = new GSize(0, 0);
icon.iconAnchor = new GPoint(6, 20);
icon.infoWindowAnchor = new GPoint(5, 1);*/

// identififiant de la div contenant la carte
//var mapId = "map";

/* KML */
// KML contenant les parcours vélib
/*var kml = "http://maps.google.fr/maps/ms?ie=UTF8&hl=fr&mpnum=3&msa=0&output=nl&msid=100906356033248349925.000436272d1b3fa08118c"
var pistes = new GGeoXml(kml);*/
// KML externe contenant les arrondissements
/*var kml2 = "http://maps.google.fr/maps/ms?ie=UTF8&hl=fr&msa=0&output=nl&msid=103763259662194171141.000001119b4b856600854"
var arrondissements = new GGeoXml(kml2);*/

/* FONCTIONS */

// fonction permettant d'afficher les infos relative à la station vélib
// paramètre : station_number = numero de la station vélib
/*function afficheDataStation(station_number, data) {
	$.ajax({
		type: "GET",
		url: "http://local.webproject.com/xml/stations-velib.php?action=getInfos&station_number=" + station_number,
		dataType: "xml",
		success: function(xmlData)
		{
			$(xmlData).find("station").each(function() { 
				var marker = $(this); 
				var velosDispos = marker.children("available").text();
				var emplacementsDispos = marker.children("free").text();
				var html = "<p><strong>velos disponibles</strong> : "+velosDispos+"</p>";
				html += "<p><strong>emplacements libres</strong> : "+emplacementsDispos+"</p>";
				$("#infosStations").replaceWith(html);
				$("td#nb-selected").text(velosDispos);
				$("td#emp-selected").text(emplacementsDispos);

				/* Récupération des informations */
				/*var html_name_station = $(data).html();
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
}*/

// fonction permettant de créer les différents icone velib sur la carte
/* poramètres :
	station_number = numéro de la station velib
	point = propriétés du marqueur velib
	html = contenu de la bulle d'infos
*/
/*function returnInfo(station_number, point, html) {
	var marker = new GMarker(point, icon);
	GEvent.addListener(marker, "click", function() {
		marker.openInfoWindowHtml(html + '<div style=\"width:222px;height:30px;display:block\" id=\"infosStations\" /><p class="loader"><img src=\"http://local.webproject.com/img/load.gif\" alt="chargement en cours..." /></p></div>');
		afficheDataStation(station_number, html);
	});
	return marker;
}*/

// fonction permettant de charger la carte avec l'ensemble des velibs
// paramètre : map = identifiant de la carte Google Map
/*function chargeCarteVelib(map) {
	$.ajax({
		type: "GET",
		url: "http://local.webproject.com/xml/stations-velib.php",
		dataType: "xml",
		success: function(xmlData)
		{
			console.log(xmlData);
			$(xmlData).find("marker").each(function(m) { 
				var marker = $(this); 
				var lat = marker.attr("lat"); // latitude
				var lng = marker.attr("lng"); // longitude
				var address = marker.attr("fullAddress"); // adresse complète
				var label = marker.attr("name"); // nom de la station
				var station_number = marker.attr("number"); // numéro de la station vélib
				var point = new GLatLng(lat,lng); // on créé les différents points correspondant à des stations vélib
				var html = "<p><strong>"+label+"</strong></p>";
				html += "<p id='lat-long-info' data-long="+lng+" data-lat="+lat+">"+address+"</p>";
				var marker2 = returnInfo(station_number,point,html)
				map.addOverlay(marker2);
			});
		}
	});
}*/

// fonction permettant d'ajouter des fonctions supplémentaires à la carte
// paramètre : map = identifiant de la carte Google Map
/*function ajoutInfos (map) {

	//affiche les parcours velib
	$('#affichevelib').click(function() {
		if ($(this).attr("checked") == true) // verifie si le champs est coché
			map.addOverlay(pistes);
		else
			map.removeOverlay(pistes);
	});
	//affiche les arrondissements
	$('#arrondissement').click(function() {
		if($(this).attr("checked")  == true) // verifie si le champs est coché
			map.addOverlay(arrondissements);
		else
			map.removeOverlay(arrondissements);
	});
}*/

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

// CHARGEMENT DE LA PAGE
/*$(document).ready(function(){
	// définition du calque qui accueillera la carte
	var map = new GMap2(document.getElementById(mapId));

	// Centrage de la carte
	map.setCenter(centreCarte, 15);

	// Ajoute des controles de base de la Google Map
	map.addControl(new GSmallMapControl());

	// Ajoute le type de carte "Relief"
	map.addMapType(G_PHYSICAL_MAP);

	// pour pouvoir scroller avec la souris sur la map
	map.enableScrollWheelZoom();

	// Créé une hiérarchie dans les différents type de carte
	var hierarchy = new GHierarchicalMapTypeControl();

	// Insère dans la carte satellite des données supplémentaires
	hierarchy.addRelationship(G_SATELLITE_MAP, G_HYBRID_MAP, null, true);

	// Ajoute le controle "hierarchie"
	map.addControl(hierarchy);
	
	chargeCarteVelib(map); // on charge la carte vélib
	ajoutInfos(map); // on ajoute les fonctionnalités supplémentaires
});*/