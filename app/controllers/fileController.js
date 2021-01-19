var admin = require('firebase-admin');
var serviceAccount = require("../serviceAccountKey.json");
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
    const form = formidable();
    form.parse(req, (response, fields, files)=>{
        let data=[];
        defaultDatabase.ref(fields.folder).once('value', snapshot=>{
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
        
    });
    
};

exports.file_upload_post = (req,res) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        defaultDatabase.ref(fields.folder).push().set({
            name: files.content.name,
            size: files.content.size,
            type: files.content.type
        },error => {
            let err = (error) ? true : false;
            res.json({err});
        });
    });
};

exports.new_folder_post = (req,res) => {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
        defaultDatabase.ref(fields.folder).push().set({
            name: fields.content,
            path: fields.folder,
            type: "folder"
        }, error => {
            let err = (error) ? true : false;
            res.json({err});
        });
    });
};


exports.file_delete_post = (req,res) => {
    const form = formidable();
    form.parse(req,(err,fields,files)=>{
        defaultDatabase.ref(fields.folder).child(fields.content).remove()
          .then(function() {
            res.json({err:false});
          })
          .catch(function(error) {
            res.json({err:true});
          });
    });
};

exports.folder_delete_post = (req, res) => {
    const form = formidable();
    form.parse(req,(err,fields,files)=>{
        content= JSON.parse(fields.content);
        defaultDatabase.ref(fields.folder).child(content.key).remove()
          .then(function() {
            defaultDatabase.ref(fields.folder+"/"+content.name).remove()
              .then(function() {
                res.json({err:false});
              })
              .catch(function(error) {
                res.json({err:true});
              });

          })
          .catch(function(error) {
            res.json({err:true});
          });
    });
};


exports.file_rename_post = (req,res)=>{
    const form = formidable();
    form.parse(req,(err,fields,files)=>{
        content= JSON.parse(fields.content);
        defaultDatabase.ref(fields.folder).child(content.key).set(content.file,
            error => {
            let err = (error) ? true : false;
            res.json({err});
        });
    });
};

exports.folder_rename_post = (req,res)=>{
    const form = formidable();
    form.parse(req,(err,fields,files)=>{
        content= JSON.parse(fields.content);
        defaultDatabase.ref(fields.folder).child(content.key).set(content.file,
            error => {
                if(error){
                    res.json({err:true});
                } else {
                    defaultDatabase.ref(fields.folder+"/"+content.oldName).update({key: content.newName})
                      .then(function() {
                        res.json({err:false});
                      })
                      .catch(function(error) {

                        console.log("errado");
                        res.json({err:true});
                      });
                }
        });
    });
};
/*
exports.file_upload_get = (req,res) => {
    res.render('index',{title:"File upload Get"});
}; 

exports.file_delete_get = (req,res) => {
    res.render('index',{title:"file_delete_get"});
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