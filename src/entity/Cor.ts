import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Cor {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  refId: number;

  @Column()
  catId: number;

  @Column()
  code: string;

  @Column()
  exchange: string;

  @Column()
  industryName1: string;

  @Column()
  industryName2: string;

  @Column()
  industryName3: string;

  @Column()
  totalShares: number;

  @Column()
  name: string;

  @Column()
  firstTradeDate: Date;

}
