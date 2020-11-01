import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_41', ['idrespuesta'], {})
@Index('FK_REFERENCE_52', ['idtipoperfil'], {})
@Index('FK_REFERENCE_62', ['idproveedor'], {})
@Entity('trespuestaseleccionada', { schema: 'Proveedores_test' })
export class Trespuestaseleccionada {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDRESPUESTA', nullable: true })
  idrespuesta: number | null;

  @Column('int', { name: 'IDPROVEEDOR', nullable: true })
  idproveedor: number | null;

  @Column('int', { name: 'IDTIPOPERFIL', nullable: true })
  idtipoperfil: number | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
