<?php
    $operation = $_GET['operation'];
    $opr1 = $_GET['opr1'];
    $opr2 = $_GET['opr2'];
    if ($operation == "add")
        echo $opr1 + $opr2;
    else if ($operation == "sub")
        echo $opr1 - $opr2;
    else if ($operation == "mult")
        echo $opr1 * $opr2;
    else if ($operation == "div")
        echo $opr1 / $opr2;
    else 
        echo "Unknown operation";
?>