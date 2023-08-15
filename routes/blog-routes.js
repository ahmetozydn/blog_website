const express = require('express'); // express is a framework
const blogController = require('../controller/blog-controller');
const csrf = require('../middleware/csrf');
const checkIf = require('../middleware/isAdmin');
const router = express.Router();

// dynamic link must be downside
router.get('/all-blogs',csrf, blogController.get_all_blogs);
router.get('/create', csrf,blogController.blog_create_get); // structure like switch-case
router.get('/my-blogs',blogController.user_blogs);
router.post('/update',blogController.update_post);
router.post('/delete-post',blogController.blog_delete);
router.get('/post-get/:id',blogController.post_get);    
router.get('/:id', blogController.blog_details);
router.delete('/:id', blogController.blog_delete);
router.get('/', blogController.blog_index);
router.post('/', blogController.blog_create_post);


module.exports = router;