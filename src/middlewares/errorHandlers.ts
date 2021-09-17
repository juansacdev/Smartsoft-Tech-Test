/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import boom from '@hapi/boom'
import config from '../config'
import { nextType, reqType, resType } from '../config/expressTypes'

const errorStack = (err, stack) => {
	if (config.isDevEnv) {
		return { ...err, stack }
	}
	return err
}

export const logErrors = (
	err,
	_req: reqType,
	_res: resType,
	next: nextType,
) => {
	if (config.isDevEnv) console.log(err)
	else console.log(err.message)
	next(err)
}

export const wrapErrors = (
	err,
	_req: reqType,
	_res: resType,
	next: nextType,
) => {
	if (!err.isBoom) next(boom.badImplementation(err))
	next(err)
}

export const errorHandler = (
	err,
	_req: reqType,
	res: resType,
	_next: nextType,
) => {
	const {
		output: { statusCode, payload },
	} = err
	res.status(statusCode)
	res.json(errorStack(payload, err.stack))
}
