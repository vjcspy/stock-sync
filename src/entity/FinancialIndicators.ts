import {Entity, PrimaryGeneratedColumn, Column, Unique} from 'typeorm';

@Entity()
@Unique(['code', 'periodBegin','periodEnd'])
export class FinancialIndicators {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: '10'
  })
  code: string;

  @Column({
    type: 'tinyint',
  })
  quarter: number;

  @Column({
    type: 'smallint',
  })
  year: number;

  @Column({
    type: 'tinyint',
  })
  termType: number;

  @Column({
    type: 'varchar',
    length: '6'
  })
  periodBegin: string

  @Column({
    type: 'varchar',
    length: '6'
  })
  periodEnd: string

  @Column({
    type: 'varchar',
    length: '2'
  })
  termCode: string

  // HN: hợp nhất / ĐL: Đơn lẻ / CTM: công ty mẹ
  @Column({
    type: 'varchar',
    length: '3'
  })
  united: string

  // CKT: Chưa kiểm toán / SX: Soát xét / KT: Kiểm toán
  @Column({
    type: 'varchar',
    length: '3'
  })
  auditedStatus: string

  @Column()
  termName: string

  @Column('decimal', {precision: 8, scale: 3})
  eps: number;

  // Giá trị sổ sách
  @Column('decimal', {precision: 8, scale: 3})
  bvps: number;

  @Column('decimal', {precision: 8, scale: 3})
  pe: number;

  @Column('decimal', {precision: 8, scale: 3})
  pb: number;

  // Tỷ suất lợi nhuận gộp biên
  @Column('decimal', { precision: 8, scale: 3 })
  grossProfitMargin: number;

  // Tỷ suất lợi nhuận trên doanh thu thuần
  @Column('decimal', { precision: 8, scale: 3 })
  netProfitMargin: number;

  // Tỷ suất lợi nhuận trên vốn chủ sở hữu bình quân
  @Column('decimal', { precision: 8, scale: 3 })
  roea: number;

  // Tỷ suất lợi nhuận trên tổng tài sản bình quân
  @Column('decimal', { precision: 8, scale: 3 })
  roaa: number;

  // Tỷ sổ thanh toán hiện hành ngắn hạn
  @Column('decimal', { precision: 8, scale: 3 })
  shortTermRatio: number;

  // Khả năng thanh toán lãi vay
  @Column('decimal', { precision: 8, scale: 3 })
  interestCoverage: number;

  // Tỷ số nợ trên tổng tài sản
  @Column('decimal', { precision: 8, scale: 3 })
  liabilitiesToAssets: number;

  // Tỷ số nợ vay trên VCSH
  @Column('decimal', { precision: 8, scale: 3 })
  debtToEquity: number;
}
