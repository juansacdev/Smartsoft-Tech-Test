import { Router } from 'express'
import isAdmin from '../../middlewares/isAdmin'
import verifyToken from '../../middlewares/verifyToken'
import { PurchaseController as PurchCtrl } from './controller'

const routes = Router()

routes.get('/me', [verifyToken], PurchCtrl.findAllMe)
routes.get('/me/:id', [verifyToken], PurchCtrl.findOneMe)

routes.get('/', [verifyToken, isAdmin], PurchCtrl.findAllPurch)
routes.get('/:id', [verifyToken, isAdmin], PurchCtrl.findOneById)
routes.post('/create/', [verifyToken], PurchCtrl.createOne)
routes.put(
	'/update/:purchaseId',
	[verifyToken, isAdmin],
	PurchCtrl.updateOneOrMany,
)
routes.delete(
	'/delete/:purchaseId',
	[verifyToken, isAdmin],
	PurchCtrl.deleteOneById,
)

export default routes
