import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, JoinTable, ManyToMany } from "typeorm";
import bcrypt from "bcrypt";
import { SALT } from "../config/serverConfig";
import { Roles } from "./Roles";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: false  })
  email!: string;

  // add min and max length to password ( view validation and constraints in typeorm)
  // instead of sending a plain password, send a hash of the password , to decrypt the password we use bcrypt module in npm
  @Column({  length: 200, nullable: false })
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @Column({ default: true })
  isActive!: boolean;

  @BeforeInsert()
  async hashPassword() {
    const hashedPassword = await bcrypt.hash(this.password, SALT);
    this.password = hashedPassword;
  }

  @ManyToMany(() => Roles, (roles) => roles.users)
  @JoinTable({
    name: 'user_roles', // 👈 custom through table name
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    }
  })
  roles!: Roles[];
}


