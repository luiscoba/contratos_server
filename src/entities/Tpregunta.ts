import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_36', ['idtipoperfil'], {})
@Entity('tpregunta', { schema: 'Proveedores_test' })
export class Tpregunta {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDTIPOPERFIL', nullable: true })
  idtipoperfil: number | null;

  @Column('varchar', { name: 'NOMBRE', nullable: true, length: 600 })
  nombre: string | null;

  @Column('varchar', { name: 'CODIGO', nullable: true, length: 200 })
  codigo: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
