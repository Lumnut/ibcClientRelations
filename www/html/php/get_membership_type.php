<?php
include 'db_handler.php';

$db = new DB_Handler();
if(isset($_SESSION['user'])){
    isset($_POST['chamber']) ? $chamber = $_POST['chamber'] : $chamber = $_SESSION['chamber'];
    $results = $db->getFields("SELECT type, expiry_date FROM PAYMENTTYPES where chamberID=$chamber");

    echo json_encode($results);
}
else {
    echo json_encode(false);
}
?>
