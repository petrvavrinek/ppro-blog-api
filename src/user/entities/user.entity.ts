import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ length: 60 })
  username!: string;

  @Property({ length: 255, hidden: true })
  password!: string;
}
