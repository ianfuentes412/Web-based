
const $ijf = {};
$ijf._expressions = {};
$ijf.initialize = () => {
    //model

    var objs = document.querySelectorAll('input[ijf-model]');
    for (let i = 0; i < objs.length; i++) {
        let model = objs[i].getAttribute('ijf-model').trim();
        $ijf[model] = objs[i].value;
        $ijf._expressions[model] = [];



    } 


    //bind
    
  
    objs = document.querySelectorAll('span[ijf-bind]');
    for (let i = 0; i < objs.length; i++) {
        let models = objs[i].getAttribute('ijf-bind').trim().split(/, */);
        for (let j = 0; j < models.length; j++) {
            let model = models[j];
            let objExpr = {output:objs[i], expr:objs[i].innerHTML};
            $ijf._expressions[model].push(objExpr);
        }
    }
    
   objs = document.querySelectorAll('input[ijf-model]');
    for (let i = 0; i < objs.length; i++) {
        let model = objs[i].getAttribute('ijf-model').trim();

        objs[i].addEventListener('keyup', function(){
            $ijf[model] = objs[i].value;
            for(let j = 0; j < $ijf._expressions[model].length; j++){
                    let objExpr = $ijf._expressions[model][j];
                    objExpr.output.innerHTML = eval(objExpr.expr);
            }
        });


    } 
    
}








