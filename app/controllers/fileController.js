//firebase admin
var admin = require('firebase-admin');
var serviceAccount = require("../serviceAccountKey.json");

// fireabse admin pt2
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ksong-f8993-default-rtdb.firebaseio.com"
});
var defaultDatabase = admin.database();

formidable = require('formidable');

exports.index = (req,res) => {
    res.render('index',{title:'Library'});
};

exports.list_files_post = (req,res) => {
    let data=[];
    defaultDatabase.ref('users/').once('value', snapshot=>{
        snapshot.forEach(snapshotItem => {
            let key = snapshotItem.key;
            let items = snapshotItem.val();
            if(items.type){
                data.push({
                    key: key,
                    items: items
                });
            }
        });
        res.json({data});
    });
}

exports.file_upload_post = (req,res) => {
    //send all files
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if(Array.isArray(files["files[]"])){
            files["files[]"].forEach(file=>{
                defaultDatabase.ref('users/').push().set({
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
            });
        } else {
            file = files["files[]"];
            defaultDatabase.ref('users/').push().set({
                name: file.name,
                size: file.size,
                type: file.type
            });
        }      
    });
    // send a file
    /*
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        defaultDatabase.ref('users/').push().set({
            name: files.file.name,
            size: files.file.size,
            type: files.file.type
        },error => {
            let err = (error) ? true : false;
            res.json({err});
        });
    });
    */
};

/*
exports.file_upload_get = (req,res) => {
    res.render('index',{title:"File upload Get"});
}; 

exports.file_delete_get = (req,res) => {
    res.render('index',{title:"file_delete_get"});
};
exports.file_delete_post = (req,res) => {
    res.render('index',{title:"file_delete_post"});
};

exports.file_update_get = (req,res) => {
    res.render('index',{title:"File update get"});
};
exports.file_update_post = (req,res) => {
    res.render('index',{title:"File update post"});
};

exports.file_detail = (req,res) => {
    res.render('index',{title:"File detail"});
};
*/