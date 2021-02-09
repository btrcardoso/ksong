var admin = require('firebase-admin');
var serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ksong-f8993-default-rtdb.firebaseio.com"
});
var defaultDatabase = admin.database();

var formidable = require('formidable');
var fs= require('fs');

/*
function getFiles(folder){
    this.data=[];
    defaultDatabase.ref(folder).once('value', snapshot=>{
        snapshot.forEach(snapshotItem => {
            let key = snapshotItem.key;
            let items = snapshotItem.val();
            if(items.type){
                this.data.push({
                    key: key,
                    items: items
                });
            }
        });
        console.log("dentro da função: ",this.data);
    });
    console.log("fora da função: ",this.data);
    return this.data;
}
*/

exports.index = (req,res) => {
    res.render('index',{title:'ksong'});
};

exports.list_files_post = (req,res) => {
    /*
    const form = formidable();
    form.parse(req, (response, fields, files)=>{
        data = getFiles(fields.folder);
        console.log(data);
        res.json({data});
    });
    */
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
    //const form = formidable({ multiples: true });
    let form = new formidable.IncomingForm({
        uploadDir: './upload',
        keepExtensions: true
      });
    form.parse(req, (err, fields, files) => {
        if(files.content){
            defaultDatabase.ref(fields.folder).push().set({
                name: files.content.name,
                size: files.content.size,
                type: files.content.type,
                path: files.content.path
            },error => {
                let err;
                if(error){
                    err = true;
                } else {
                    err = false;
                }
                res.json({err});
            });
        }         
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
    let form = new formidable.IncomingForm({
        multiples: true,
        uploadDir: './upload',
        keepExtensions: true
    });
    form.parse(req,(err,fields,files)=>{
        let arrayContent = JSON.parse("["+fields['content[]']+"]");
        let er=false;
        let msg;
        arrayContent.forEach(content=>{
            path = content.file.path;
            if(fs.existsSync(path)){
              fs.unlink(path, err => {});
            }
            defaultDatabase.ref(fields.folder).child(content.key).remove().then(function(){
                if(content.file.type=='folder') {
                    defaultDatabase.ref(fields.folder+"/"+content.file.name).remove();
                }
            });
        });
        res.json({err:er});
    });
    /*
    let form = new formidable.IncomingForm({
        uploadDir: './upload',
        keepExtensions: true
    });
    form.parse(req,(err,fields,files)=>{
        content= JSON.parse(fields.content);
        path = content.file.path;

        console.log(content.key+": "+content.file.path);

        if(fs.existsSync(path)){
          fs.unlink(path, err => { // Asynchronously removes a file or symbolic link
            if(err) {
                console.log("erro");res.status(400).json({err});
            }
            else {
                console.log("apagando: "+content.key)
                defaultDatabase.ref(fields.folder).child(content.key).remove()
                  .then(function() {
                    res.json({err:false});
                  })
                  .catch(function(error) {
                    res.json({err:true});
                  });
            }
          });
        } else {
          res.status(404).json({error:'File not found'});
        }
    });
    */
};

//pode apagar
exports.folder_delete_post = (req, res) => {
    const form = formidable();
    form.parse(req,(err,fields,files)=>{
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

function addFilesAndFolders(folder,oldName,newName){
    defaultDatabase.ref(folder+"/"+oldName).once('value', snapshot=>{
        console.log(folder+"/"+oldName);
        let data = [];
        let err = false;
        snapshot.forEach(snapshotItem => {
            console.log("key: ");
            console.log(snapshotItem.key);
            console.log("typeof key: ",typeof snapshotItem.key);
            console.log(" ");
            defaultDatabase.ref(folder+"/"+newName).push().set(snapshotItem.val(), error => {
                err = (error) ? true : false;
            });
        });
        //res.json({err});
    });
}

//nao ta fazendo tudo
exports.folder_rename_post = (req,res)=>{
    const form = formidable();
    form.parse(req,(err,fields,files)=>{
        content= JSON.parse(fields.content);
        defaultDatabase.ref(fields.folder).child(content.key).set(content.file,
            error => {
                if(error){
                    res.json({err:true});
                } else {
                    addFilesAndFolders(fields.folder,content.oldName,content.newName);
                    /*
                    defaultDatabase.ref(fields.folder+"/"+content.oldName).once('value', snapshot=>{
                        console.log(fields.folder+"/"+content.oldName);
                        let data = [];
                        let err = false;
                        snapshot.forEach(snapshotItem => {
                            console.log(typeof snapshotItem);
                            defaultDatabase.ref(fields.folder+"/"+content.newName).push().set(snapshotItem.val(), error => {
                                err = (error) ? true : false;
                            });
                        });
                        res.json({err});
                    });
                    */
                    res.json({err:false});
                }
            }
        );
    });
};

exports.file_get = (req,res)=>{
    let path = './'+req.query.path;
    if(fs.existsSync(path)){
        fs.readFile(path,(err,data)=>{
            if(err){
                console.error(err);
                res.status(400).json({error:err});
            } else{
                res.status(200).end(data);
            }
        });
    } else {
        res.status(404).json({error:'File not found'});
    }
}
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