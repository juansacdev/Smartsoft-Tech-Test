import { Router } from 'express'
import isAdmin from '../../middlewares/isAdmin'
import verifyToken from '../../middlewares/verifyToken'
import { ProducController as ProdCtrl } from './controller'

const routes = Router()

routes.get('/', [verifyToken], ProdCtrl.findAllProds)
routes.get('/:id', [verifyToken], ProdCtrl.findOneProdById)
routes.post('/create', [verifyToken, isAdmin], ProdCtrl.createOneProd)
routes.put('/update/:id', [verifyToken, isAdmin], ProdCtrl.updateOneProdById)
routes.delete('/delete/:id', [verifyToken, isAdmin], ProdCtrl.deleteOneProdById)

export default routes
