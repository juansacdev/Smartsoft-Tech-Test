import { Router } from 'express'
import { AuthController as AuhtCtrl } from './controller'

const routes = Router()

routes.post('/signup', AuhtCtrl.signUp)
routes.post('/signup/admin', AuhtCtrl.signUpAdmin)
routes.post('/signin', AuhtCtrl.signIn)

export default routes
