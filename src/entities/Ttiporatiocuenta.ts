import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_56', ['idtiporatio'], {})
@Index('FK_REFERENCE_58', ['idcuenta'], {})
@Entity('ttiporatiocuenta', { schema: 'Proveedores_test' })
export class Ttiporatiocuenta {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDTIPORATIO', nullable: true })
  idtiporatio: number | null;

  @Column('int', { name: 'IDCUENTA', nullable: true })
  idcuenta: number | null;
}
