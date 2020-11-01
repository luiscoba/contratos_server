import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_53', ['idtipoproveedor'], {})
@Index('FK_REFERENCE_69', ['idtipocontribuyente'], {})
@Entity('tidentificacionproveedor', { schema: 'Proveedores_test' })
export class Tidentificacionproveedor {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDTIPOPROVEEDOR', nullable: true })
  idtipoproveedor: number | null;

  @Column('int', { name: 'IDTIPOCONTRIBUYENTE', nullable: true })
  idtipocontribuyente: number | null;

  @Column('varchar', { name: 'RUCRISE', nullable: true, length: 15 })
  rucrise: string | null;

  @Column('varchar', { name: 'NOMBRERAZONSOCIAL', nullable: true, length: 100 })
  nombrerazonsocial: string | null;

  @Column('varchar', { name: 'NOMBRECOMERCIAL', nullable: true, length: 100 })
  nombrecomercial: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
