<script>
    // We assume that the 'load' event was triggered.
    //window.addEventListener('load', function() {
        initialize();
    //});
    function initialize() {
        $trujs = {};
        $trujs._expressions = {};  // for $trujs._expressions
        // ...
        alert(JSON.stringify($trujs));  // for testing
    }
</script>

<script>
    var objs = document.querySelectorAll('div[trujs-app=E1App] span[trujs-init]');
    for (let i = 0; i < objs.length; i++) {
        let attrValue = objs[i].getAttribute('trujs-init');
        eval(attrValue);
    }
    for (let p in $trujs) {
        if (p != '_expressions' && p != '_initialize')
            $trujs._expressions[p] = [];
    }
        
    alert(JSON.stringify($trujs));
</script>
<script>
    objs = document.querySelectorAll('div[trujs-app=E2App] input[trujs-model]');
    for (let i = 0; i < objs.length; i++) {
        let model = objs[i].getAttribute('trujs-model').trim();
        let value = objs[i].value;
        $trujs[model] = value;
        $trujs._expressions[model] = [];
    }
    alert(JSON.stringify($trujs));
</script>
<div trujs-app='E3App'>
    x + z = <span trujs-bind='x, z'>Number($trujs.x) + Number($trujs.z)</span><br>
    z * z = <span trujs-bind='z'>$trujs.z * $trujs.z</span><br>
</div>
<script>
    var objs = document.querySelectorAll('div[trujs-app=E3App] span[trujs-bind]');
    for (let i = 0; i < objs.length; i++) {
        let models = objs[i].getAttribute('trujs-bind').trim().split(/, */);
        for (let j = 0; j < models.length; j++) {
            let model = models[j];
            let objExpr = {output:objs[i], expr:objs[i].innerHTML};
            $trujs._expressions[model].push(objExpr);
        }
    }
    alert(JSON.stringify($trujs));
</script>
Exercise 5 Trial E4
<div trujs-app='E4App'>
    x = <input trujs-model='x'><br>
    z = <input trujs-model='z'><br>
</div>

<script>
    var objs = document.querySelectorAll('div[trujs-app=E4App] input[trujs-model]');
    for (let i = 0; i < objs.length; i++) {
        let model = objs[i].getAttribute('trujs-model').trim();
        objs[i].addEventListener('keyup', function() {
            // update model in $turjs
            $trujs[model] = objs[i].value;
            // for each bound output span, update the content by evaluating the expression
            for (let j = 0; j < $trujs._expressions[model].length; j++) {
                let objExpr = $trujs._expressions[model][j];
                objExpr.output.innerHTML = eval(objExpr.expr);
            }
        });
    }
</script>