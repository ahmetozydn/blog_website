const express = require('express'); // express is a framework
const blogController = require('../controller/blog-controller');
const csrf = require('../middleware/csrf');

const router = express.Router();

// dynamic link must be downside

router.get('/create', csrf,blogController.blog_create_get); // structure like switch-case
router.get('/', blogController.blog_index);
router.get('/my-blogs',blogController.user_blogs);
router.post('/delete-post',csrf,blogController.blog_delete);
router.post('/', blogController.blog_create_post);
router.get('/post-get/:id',blogController.post_get);    
router.get('/:id', blogController.blog_details);
router.delete('/:id', blogController.blog_delete);

module.exports = router;