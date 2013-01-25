<?php
if ($_GET["action"] == "getInfos")  {
	$urldetailStation = "http://www.velib.paris.fr/service/stationdetails/".$_GET["station_number"];
	header("content-type: text/xml");
	$handle = fopen($urldetailStation, "rb");
	$contents = '';
	while (!feof($handle)) {
		$contents .= fread($handle, 8200);
	}
	fclose($handle);

	echo $contents;
}
else {
	$carteVelib = "http://www.velib.paris.fr/service/carto/";
	header("content-type: text/xml");

	$handle = fopen($carteVelib, "rb");
	$contents = '';
	while (!feof($handle)) {
		$contents .= fread($handle, 8200);
	}
	fclose($handle);

	echo $contents;
}
?>