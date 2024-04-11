

function $ijf(x)
{
     if(x == document) 
        return {
            ready: function(callback){
                window.addEventListener('load',function(){
                    callback();
                });
            }
        };

    else if(typeof x == 'string') 
        return {
            click: function(callback){
                document.addEventListener('click',function(e){
                    callback(e);
                });
            },
            html: function(content){
                if (content == undefined){
                    return document.querySelector(x).innerHTML;
                }
                else{
                    document.querySelector(x).innerHTML = content;
                }

            },
            val: function(content){
                if(content == undefined){
                    return document.querySelector(x).value;
                }
                else{
                    document.querySelector(x).value = content;
                } 
            },

            css: function(property, value){
                if(value == undefined){
                    return window.getComputedStyle(document.querySelector(x)).getPropertyValue(property);
                }
                else{
                    document.querySelector(x).setAttribute('style',property+':'+value);
                } 
            },
            
            load: function(url) {
                let xhttp = new XMLHttpRequest();
                xhttp.addEventListener('load', function() {
                    document.querySelector(x).innerHTML = xhttp.responseText;
                });
                xhttp.open('GET', url);
                xhttp.send();
            }



        };

    else if(x == undefined) 
        return "undefined";
    else 
        return "something else"; 

}


$ijf.get = (url,callback) => {
    let xhttp = new XMLHttpRequest();
    xhttp.addEventListener('load', function() {
        callback(xhttp.responseText);
    });
    xhttp.open('GET', url);
    xhttp.send();
}



