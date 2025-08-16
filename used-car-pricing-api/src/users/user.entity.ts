import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User With id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('updated use wtih');
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id');
  }
}
