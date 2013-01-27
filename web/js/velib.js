

// positionne le focus de la carte
var centreCarte = new GLatLng(48.867095, 2.322367);

// Personnalisation de l'icone du velib 
var icon = new GIcon();
icon.image = "http://local.webproject.com/img/velib.png";
icon.iconSize = new GSize(12, 20);
icon.shadowSize = new GSize(0, 0);
icon.iconAnchor = new GPoint(6, 20);
icon.infoWindowAnchor = new GPoint(5, 1);

// identififiant de la div contenant la carte
var mapId = "map";

/* KML */
// KML contenant les parcours vélib
var kml = "http://maps.google.fr/maps/ms?ie=UTF8&hl=fr&mpnum=3&msa=0&output=nl&msid=100906356033248349925.000436272d1b3fa08118c"
var pistes = new GGeoXml(kml);
// KML externe contenant les arrondissements
var kml2 = "http://maps.google.fr/maps/ms?ie=UTF8&hl=fr&msa=0&output=nl&msid=103763259662194171141.000001119b4b856600854"
var arrondissements = new GGeoXml(kml2);

/* FONCTIONS */

// fonction permettant d'afficher les infos relative à la station vélib
// paramètre : station_number = numero de la station vélib
function afficheDataStation(station_number) {
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
			});
		}
	});
}

// fonction permettant de créer les différents icone velib sur la carte
/* poramètres :
	station_number = numéro de la station velib
	point = propriétés du marqueur velib
	html = contenu de la bulle d'infos
*/
function returnInfo(station_number, point, html) {
	var marker = new GMarker(point, icon);
	GEvent.addListener(marker, "click", function() {
		marker.openInfoWindowHtml(html + '<div style=\"width:222px;height:30px;display:block\" id=\"infosStations\" /><p class="loader"><img src=\"http://local.webproject.com/img/load.gif\" alt="chargement en cours..." /></p></div>');
		afficheDataStation(station_number);
	});
	return marker;
}

// fonction permettant de charger la carte avec l'ensemble des velibs
// paramètre : map = identifiant de la carte Google Map
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
				var point = new GLatLng(lat,lng); // on créé les différents points correspondant à des stations vélib
				var html = "<p><strong>"+label+"</strong></p>";
				html += "<p>"+address+"</p>";
				var marker2 = returnInfo(station_number,point,html)
				map.addOverlay(marker2);
			});
		}
	});
}

// fonction permettant d'ajouter des fonctions supplémentaires à la carte
// paramètre : map = identifiant de la carte Google Map
function ajoutInfos (map) {
	// code html qui sera inséré après la carte pour faire apparaitre les fonctionnalités
	var htmlFunction = '<form action="#" method="post" name="fonctioncarte" id="fonction-carte">';
	htmlFunction += '<p><input type="checkbox" id="arrondissement" name="aff_arrondissement" value="" /><label class="options-carte" for="arrondissement">Afficher les arrondissements</label></p>';
	htmlFunction += '<p><input type="checkbox" id="affichevelib" name="aff_velib" value="" /><label class="options-carte" for="affichevelib">Afficher les pistes cyclables</label></p>';
	htmlFunction += '</form>';
	// on ajoute le code html à la suite de la carte
	$("#map").after(htmlFunction);

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
}

// CHARGEMENT DE LA PAGE
$(document).ready(function(){
	// vérifie si le navigateur est compatible avec Google Map
	if (GBrowserIsCompatible()) {
		// définition du calque qui accueillera la carte
		var map = new GMap2(document.getElementById(mapId));
		// Centrage de la carte
		map.setCenter(centreCarte, 15);
		// Ajoute des controles de base de la Google Map
		map.addControl(new GSmallMapControl());
		// Ajoute le type de carte "Relief"
		map.addMapType(G_PHYSICAL_MAP);
		// Créé une hiérarchie dans les différents type de carte
		var hierarchy = new GHierarchicalMapTypeControl();
		// Insère dans la carte satellite des données supplémentaires
		hierarchy.addRelationship(G_SATELLITE_MAP, G_HYBRID_MAP, null, true);
		// Ajoute le controle "hierarchie"
		map.addControl(hierarchy);
		
		chargeCarteVelib(map); // on charge la carte vélib
		ajoutInfos(map); // on ajoute les fonctionnalités supplémentaires
	}
});