import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { PurchaseEntity } from './Purchase'
import { RolesEntity } from './Role'

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	firts_name: string

	@Column()
	last_name: string

	@Column({
		unique: true,
	})
	email: string

	@Column()
	password: string

	@Column({ nullable: true })
	money: number

	@OneToMany(() => PurchaseEntity, purchase => purchase.user)
	purchases: PurchaseEntity[]

	@ManyToOne(() => RolesEntity)
	@JoinColumn({ name: 'role_id' })
	role: RolesEntity
}
