// If Model were revised, the cached Model module may need to be deleted.
delete require.cache[require.resolve("./chat_model.js")];
const model = require("./chat_model.js");


const proceed = function(_GET, _POST, callback)
{

    switch(_POST['command'])
    {

        case 'Join':

        model.ready(function(result) {
            if(result){
                model.usernameExists(_POST['username'], function(result){
                    if(result == false){
                        model.registerUser(_POST['username'],_POST['password'],_POST['email'] ,function(result){
                            if(result) callback("Joined");
                            else callback("Joining Failed");
                        });
                    }
                    else{
                        callback("Username already exists");
                    }
                });
                }
            });
        break;

        case 'SignIn':

        model.ready(function(result) {
            if (result)
                model.validateUsernamePassword(_POST['username'], _POST['password'], function(result) {
                    if(result) callback('SignIn Successful');
                    else callback("SignIn failed");
            });
        });

        break;

        case 'Delete':
            model.ready(function(result) {
                if (result)
                {
                    model.validateUsernamePassword(_POST['username'], _POST['password'], function(result){
                        if(result) {
                            model.deleteUser(_POST['username'], _POST['password'], function(result){
                                if(result) callback("Account Deleted");
                                else callback("Invalid username and/or password; Not deleted");
                            }
                        )}
                        else{
                            callback('Account Not Found');
                        };
                    });

                }

        });
//
        break;

        case 'Close':
                model.ready(function (result){
                    if(result)
                        {
                        model.close();
                        callback('Closed');
                    }
                });

        break;

        default:
            callback("Unknown Error");
            break;

    }


}
exports.proceed = proceed;


