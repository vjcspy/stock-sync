import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['code', 'lastDate'])
export class StockPriceSyncStatus {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: '10',
    unique:true
  })
  code: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  lastDate: Date;
}
