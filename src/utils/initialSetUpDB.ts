import { Connection, getConnection } from 'typeorm'
import { ProductEntity } from '../entities/Product'
import { RolesEntity } from '../entities/Role'

export async function setInitalValues(connection: Connection): Promise<void> {
	await connection.runMigrations()
	// This could be an migration with data seed.
	// Ref: https://sushilkbansal.medium.com/how-to-seed-typeorm-d9637a5948cc
	const [{ count: countRoles }] = await getConnection()
		.createQueryBuilder()
		.select('COUNT(*)')
		.from(RolesEntity, 'roles')
		.execute()

	const [{ count: countProducts }] = await getConnection()
		.createQueryBuilder()
		.select('COUNT(*)')
		.from(ProductEntity, 'products')
		.execute()

	if (countRoles === '0') {
		await getConnection()
			.createQueryBuilder()
			.insert()
			.into(RolesEntity)
			.values([{ name: 'Admin' }, { name: 'Client' }])
			.execute()
	}

	if (countProducts === '0') {
		await getConnection()
			.createQueryBuilder()
			.insert()
			.into(ProductEntity)
			.values([
				{
					name: 'Celular',
					category: 'Technology',
					price: 300,
					quantity_stock: 40,
				},
				{
					name: 'Devil My Cry',
					category: 'Games',
					price: 50,
					quantity_stock: 40,
				},
				{
					name: 'Pizza',
					category: 'Food',
					price: 5,
					quantity_stock: 40,
				},
				{
					name: 'Mac M1',
					category: 'Technology',
					price: 1500,
					quantity_stock: 40,
				},
				{
					name: 'Crash',
					category: 'Games',
					price: 100,
					quantity_stock: 40,
				},
				{
					name: 'Sandwich',
					category: 'Food',
					price: 5,
					quantity_stock: 40,
				},
			])
			.execute()
	}
}
