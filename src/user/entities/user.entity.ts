import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 60 })
  username!: string;

  @Column({ length: 255, select: false })
  password!: string;

  @CreateDateColumn()
  createdAt = new Date();
}
