<?php
  session_start();
  // Verify that the user has signed in and enfore if they have not
  if(!$_SESSION['user'])
    header('Location: calendar.php');
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Illawarra Business Chamber | Calendar</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="css/theme.css">
  </head>

  <
  <body>
    <h1> Your Upcoming Events </h1>



  </body>
</html>