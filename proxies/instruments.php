<?php
	// Proxy to get instruments

	header('Content-type: application/json');
	print file_get_contents('http://extras.ddfplus.com/json/instruments/?lookup='.$_REQUEST['lookup']);
?>
