<?php
include 'db_handler.php';

//get active chambers
$db = new DB_Handler();

if(isset($_SESSION['user'])){
    $mode = $_POST["mode"];
    $results = $db->getChamberList($mode);

    echo json_encode($results);
}
else {
    echo json_encode(false);
}

?>
