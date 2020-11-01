import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_39', ['idperfilsistema'], {})
@Index('FK_REFERENCE_63', ['idusuariosistema'], {})
@Entity('tusuarioperfilsistema', { schema: 'Proveedores_test' })
export class Tusuarioperfilsistema {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDUSUARIOSISTEMA', nullable: true })
  idusuariosistema: number | null;

  @Column('int', { name: 'IDPERFILSISTEMA', nullable: true })
  idperfilsistema: number | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
