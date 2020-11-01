import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_32', ['idtiporatio'], {})
@Entity('tratiofinanciero', { schema: 'Proveedores_test' })
export class Tratiofinanciero {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDTIPORATIO', nullable: true })
  idtiporatio: number | null;

  @Column('decimal', {
    name: 'PORCENTAJE',
    nullable: true,
    precision: 2,
    scale: 2,
  })
  porcentaje: string | null;

  @Column('decimal', { name: 'RATIO', nullable: true, precision: 6, scale: 2 })
  ratio: string | null;

  @Column('varchar', { name: 'ANIOACTUAL', nullable: true, length: 4 })
  anioactual: string | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;
}
