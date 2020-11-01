import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_55', ['ididentificacionproveedor'], {})
@Index('FK_REFERENCE_71', ['idcatalogocategoria'], {})
@Entity('tproveedoractividad', { schema: 'Proveedores_test' })
export class Tproveedoractividad {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDIDENTIFICACIONPROVEEDOR', nullable: true })
  ididentificacionproveedor: number | null;

  @Column('int', { name: 'IDCATALOGOCATEGORIA', nullable: true })
  idcatalogocategoria: number | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;
}
