import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_61', ['idtipopersona'], {})
@Entity('tperfilfinanciero', { schema: 'Proveedores_test' })
export class Tperfilfinanciero {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID', comment: 'Es el id' })
  id: number;

  @Column('int', { name: 'IDTIPOPERSONA', nullable: true })
  idtipopersona: number | null;

  @Column('decimal', { name: 'PESO', nullable: true, precision: 3, scale: 2 })
  peso: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
