<?php
  include 'db_handler.php';
  $db = new DB_Handler();

  if(isset($_SESSION['user'])){
      $EventID = $_POST['EventID'];

      $going = $db->get_EventGoing($EventID);
      $notGoing = $db->get_EventNotGoing($EventID);
      $total = $db->get_EventCount($EventID);
      $attending = $db->get_EventNamesAttending($EventID);
      $notgoing = $db->get_EventNamesNotGoing($EventID);
      echo json_encode(array($going, $notGoing, $total, $attending, $notgoing));
  }
  else {
      echo json_encode(false);
  }
?>
