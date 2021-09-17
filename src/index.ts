import express from 'express'
import morgan from 'morgan'
import 'reflect-metadata'
import { Connection, createConnection } from 'typeorm'
import config from './config'
import {
	errorHandler,
	logErrors,
	wrapErrors,
} from './middlewares/errorHandlers'
import notFoundHandler from './middlewares/notFound'
import router from './routes'
import { setInitalValues } from './utils/initialSetUpDB'

const app = express()
if (config.isDevEnv) {
	app.use(morgan('dev'))
}
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

router(app)

// Error 404
app.use(notFoundHandler)

// Errors middlewares
app.use(logErrors)
app.use(wrapErrors)
app.use(errorHandler)

createConnection()
	.then(async (connection: Connection) => {
		await setInitalValues(connection)
		app.listen(config.port, () =>
			console.log(`I'm alive on: http://localhost:${config.port}`),
		)
	})
	.catch(e => console.log(e))
