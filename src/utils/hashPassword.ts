import bcryptjs from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
	const salt = await bcryptjs.genSalt(10)
	return bcryptjs.hash(password, salt)
}

export async function isValidPassword(
	rawPassword: string,
	hashPassword: string,
): Promise<boolean> {
	// here the await is unnecessary
	return await bcryptjs.compare(rawPassword, hashPassword)
}
