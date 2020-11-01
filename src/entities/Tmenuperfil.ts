import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_37', ['idmenu'], {})
@Index('FK_REFERENCE_38', ['tperfilsistema'], {})
@Entity('tmenuperfil', { schema: 'Proveedores_test' })
export class Tmenuperfil {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDMENU', nullable: true })
  idmenu: number | null;

  @Column('int', { name: 'TPERFILSISTEMA', nullable: true })
  tperfilsistema: number | null;
}
