import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['code', 'date'])
export class StockPriceSyncStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  last_date: Date;
}
