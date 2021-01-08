//firebase admin
var admin = require('firebase-admin');
var serviceAccount = require("../serviceAccountKey.json");

// fireabse admin pt2
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ksong-f8993-default-rtdb.firebaseio.com"
});

var defaultDatabase = admin.database();

exports.index = (req,res) => {
	let data=[];
	defaultDatabase.ref('users/').on('value', snapshot=>{
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
        console.log(typeof data);
        res.render('index',{title:'Library',data});
    });
};

/*
exports.file_upload_get = (req,res) => {
    res.render('index',{title:"File upload Get"});
}; 
exports.file_upload_post = (req,res) => {
    res.render('index',{title:"File upload Post"});
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