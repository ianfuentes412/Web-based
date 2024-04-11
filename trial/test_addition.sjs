const proceed = function(_GET,_POST,callback) {
    if (_GET != undefined && _GET['operation'] == 'add') {
        var result = Number(_GET['op1']) + Number(_GET['op2']);
        callback(result);
    }
    if (_POST != undefined && _POST['operation'] == 'add') {
        var result = Number(_POST['op1']) + Number(_POST['op2']);
        callback(result);
    }
}

exports.proceed = proceed;