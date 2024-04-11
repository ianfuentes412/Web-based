<?php
    $operation = $_GET['operation'];
    $opr1 = $_GET['opr1'];
    $opr2 = $_GET['opr2'];
    if ($operation == "add")
        echo $opr1 + $opr2;
    else if ($operation == "subtract")
        echo $opr1 - $opr2;
    else if ($operation == "multiply")
        echo $opr1 * $opr2;
    else if ($operation == "divide")
        echo $opr1 / $opr2;
    else 
        echo "Unknown operation";
?>