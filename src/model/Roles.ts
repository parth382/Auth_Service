import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, ManyToMany } from "typeorm";
import { User } from "./User";

@Entity("roles")
export class Roles {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false , unique:true  })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToMany(() => Roles, (roles) => roles.users)
  users!: User[];
}


