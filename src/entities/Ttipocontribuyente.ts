import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_54', ['idtipopersona'], {})
@Entity('ttipocontribuyente', { schema: 'Proveedores_test' })
export class Ttipocontribuyente {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDTIPOPERSONA', nullable: true })
  idtipopersona: number | null;

  @Column('varchar', { name: 'NOMBRE', nullable: true, length: 100 })
  nombre: string | null;

  @Column('varchar', { name: 'CODIGO', nullable: true, length: 50 })
  codigo: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
