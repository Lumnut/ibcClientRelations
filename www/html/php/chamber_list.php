<?php
include 'db_handler.php';

$db = new DB_Handler();
$results = $db->getList("SELECT chamberID, name FROM CHAMBER where parent_id=1 ORDER BY name DESC");

echo json_encode($results);

?>
