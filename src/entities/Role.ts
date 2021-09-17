import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { UsersEntity } from './User'

@Entity({ name: 'roles' })
export class RolesEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@OneToMany(() => UsersEntity, user => user.role)
	users: UsersEntity[]
}
