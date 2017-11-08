var admin = require('../controller/admin')
var express = require('express')
var router = express.Router();

// router.use((req, res, next) => {
//     console.log('admin/login ROUTER middleware');
//     next();
// })

router.post('/login', admin.login)

router.route('/product')
      .get(admin.product_list)
      .post(admin.product_add)
      .put(admin.product_update)
      .delete(admin.product_delete)



module.exports = router