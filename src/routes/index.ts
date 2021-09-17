import authRoutes from '../API/auth/network'
import productRoutes from '../API/products/network'
import purchasesRoutes from '../API/purchases/network'
import userRoutes from '../API/users/network'
import { appExpress } from '../config/expressTypes'

const routes = (server: appExpress): void => {
	server.use('/api/products', productRoutes)
	server.use('/api/auth', authRoutes)
	server.use('/api/users', userRoutes)
	server.use('/api/purchases', purchasesRoutes)
}

export default routes
