// require test_model.js
const model = require('./test_model.js');

const proceed = function() {
    model.connect("COMP4620_w4ifuentes","w4ifuentes","w4ifuentes136", conn => {
        console.log("test_app connected");  // display something with console.log()
        model.db(conn, db  => {
            console.log("Db Stub Obtained");
            model.collection(db, "Memo", (collectStub) => {
                console.log("Connection Stub Obtained");
                model.insert(collectStub, {date:"3/12/2002", memo:"Eat Well"}, () =>{
                    console.log("Document Inserted");

                    model.find(collectStub, {date:"3/12/2002"}, result =>{
                        console.log(result);
                        model.close(conn);
                        console.log("test_app closed");
                    });

                });

                model.insert(collectStub, {date:"17/25/2002", memo:"Sleep 8 Hours"}, () =>{
                    console.log("Document Inserted");

                    model.find(collectStub, {date:"17/25/2002"}, result =>{
                        console.log(result);
                        model.close(conn);
                        console.log("test_app closed");
                    });

                });

            });

        });

    });
}

proceed();