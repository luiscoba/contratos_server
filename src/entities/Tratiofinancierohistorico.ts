import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tratiofinancierohistorico', { schema: 'Proveedores_test' })
export class Tratiofinancierohistorico {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDRATIOFINANCIERO', nullable: true })
  idratiofinanciero: number | null;

  @Column('int', { name: 'ANIOACTUAL', nullable: true })
  anioactual: number | null;

  @Column('decimal', {
    name: 'PORCENTAJE',
    nullable: true,
    precision: 2,
    scale: 2,
  })
  porcentaje: string | null;

  @Column('decimal', { name: 'RATIO', nullable: true, precision: 6, scale: 2 })
  ratio: string | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
