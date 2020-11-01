import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_42', ['idproveedor'], {})
@Index('FK_REFERENCE_73', ['idcalificaburo'], {})
@Index('FK_REFERENCE_74', ['iddocumentoburo'], {})
@Entity('tproveedorcalificaburo', { schema: 'Proveedores_test' })
export class Tproveedorcalificaburo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDPROVEEDOR', nullable: true })
  idproveedor: number | null;

  @Column('int', { name: 'IDCALIFICABURO', nullable: true })
  idcalificaburo: number | null;

  @Column('int', { name: 'IDDOCUMENTOBURO', nullable: true })
  iddocumentoburo: number | null;

  @Column('decimal', {
    name: 'CALIFICACIONBURO',
    nullable: true,
    precision: 3,
    scale: 2,
  })
  calificacionburo: string | null;

  @Column('varchar', {
    name: 'NOMBRE',
    nullable: true,
    comment: 'es el nombre del archivo que ha sido subido',
    length: 150,
  })
  nombre: string | null;

  @Column('int', {
    name: 'TAMANIO',
    nullable: true,
    comment: 'es el tamanio del archivo en kb',
  })
  tamanio: number | null;

  @Column('varchar', {
    name: 'RUTA',
    nullable: true,
    comment: 'es el directorio donde se almacena el archivo',
    length: 900,
  })
  ruta: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
