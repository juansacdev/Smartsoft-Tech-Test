import express from 'express'

export type reqType = express.Request
export type resType = express.Response
export type nextType = express.NextFunction
export type appExpress = express.Application

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			user?: {
				sub: number | string
			}
		}
	}
}
