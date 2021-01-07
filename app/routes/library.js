var express = require("express");
//const { route } = require(".");
var router = express.Router();

var file_controller = require('../controllers/fileController');

router.get('/',file_controller.index);

/*

router.get('/file/upload',file_controller.file_upload_get);
router.post('/file/upload',file_controller.file_upload_post);

router.get('/file/:id/delete',file_controller.file_delete_get);
router.post('/file/:id/delete',file_controller.file_delete_post);

router.get('/file/:id/update',file_controller.file_update_get);
router.post('/file/:id/update',file_controller.file_update_post);

router.get('/file/:id',file_controller.file_detail);

*/

module.exports = router;