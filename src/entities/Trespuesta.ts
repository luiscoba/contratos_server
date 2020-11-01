import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_40', ['idpregunta'], {})
@Entity('trespuesta', { schema: 'Proveedores_test' })
export class Trespuesta {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDPREGUNTA', nullable: true })
  idpregunta: number | null;

  @Column('varchar', { name: 'NOMBRE', nullable: true, length: 100 })
  nombre: string | null;

  @Column('varchar', { name: 'CODIGO', nullable: true, length: 200 })
  codigo: string | null;

  @Column('decimal', { name: 'PESO', nullable: true, precision: 3, scale: 2 })
  peso: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
