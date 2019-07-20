var express = require('express')
var router = express.Router()
import User from '../controller/user'

router.get('/v1/getUserInfo', User.getUserInfo)
router.get('/v1/getRecord', User.getRecord)
router.post('/v1/logout', User.logout)
router.post('/v1/operationPage', User.postPage)
router.delete('/v1/operationPage', User.deletePage)
router.put('/v1/operationPage', User.putPage)
router.get('/v1/operationPage', User.getPage)
router.post('/v1/operationAdmin', User.postAdmin)
router.delete('/v1/operationAdmin', User.deleteAdmin)
router.put('/v1/operationAdmin', User.putAdmin)
router.get('/v1/operationAdmin', User.getAdmin)
router.post('/v1/operationVip', User.postVip)
router.delete('/v1/operationVip', User.deleteVip)
router.put('/v1/operationVip', User.putVip)
router.get('/v1/operationVip', User.getVip)

module.exports = router