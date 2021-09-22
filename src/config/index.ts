import { config } from 'dotenv'

config()


const envConfig = {
	isDevEnv: process.env.NODE_ENV !== 'production',
	port: process.env.PORT ?? 3000,
	// Avoid set keys in prod or env
	jwtSecret: process.env.JWT_SECRET ?? 'daqweqadas1942,-^',
}

export default envConfig
