var express = require("express");
//const { route } = require(".");
var router = express.Router();

var file_controller = require('../controllers/fileController');

router.get('/',file_controller.index);


router.post('/files',file_controller.list_files_post);

router.post('/file_upload',file_controller.file_upload_post);

router.post('/new_folder',file_controller.new_folder_post);

/*

router.get('/file/upload',file_controller.file_upload_get);

router.get('/file/:id/delete',file_controller.file_delete_get);
router.post('/file/:id/delete',file_controller.file_delete_post);

router.get('/file/:id/update',file_controller.file_update_get);
router.post('/file/:id/update',file_controller.file_update_post);

router.get('/file/:id',file_controller.file_detail);

*/

module.exports = router;