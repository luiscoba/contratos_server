import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_60', ['idcuenta'], {})
@Index('FK_REFERENCE_70', ['idperfilfinanciero'], {})
@Entity('tcuentaperfilfinanciero', { schema: 'Proveedores_test' })
export class Tcuentaperfilfinanciero {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDCUENTA', nullable: true })
  idcuenta: number | null;

  @Column('int', {
    name: 'IDPERFILFINANCIERO',
    nullable: true,
    comment: 'Es el id',
  })
  idperfilfinanciero: number | null;

  @Column('decimal', {
    name: 'RESULTADOANIOPENULTIMO',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  resultadoaniopenultimo: string | null;

  @Column('decimal', {
    name: 'RESULTADOANIOULTIMO',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  resultadoanioultimo: string | null;

  @Column('decimal', { name: 'PESO', nullable: true, precision: 3, scale: 2 })
  peso: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
