import {Column, Entity, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Entity()
@Unique(['code', 'termType'])
export class FinancialIndicatorStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        type: 'varchar',
        length: '10',
        unique: true,
    })
    code: string;

    @Column({
        type: 'tinyint',
        nullable: false,
    })
    termType: number;

    @Column({
        type: 'varchar',
        length: '4',
        nullable: false,
    })
    year: string;

    @Column({
        type: 'varchar',
        length: '1',
        nullable: true,
    })
    quarter: string;
}
