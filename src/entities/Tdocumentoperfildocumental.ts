import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_44', ['idperfildocumental'], {})
@Index('FK_REFERENCE_65', ['iddocumento'], {})
@Entity('tdocumentoperfildocumental', { schema: 'Proveedores_test' })
export class Tdocumentoperfildocumental {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDPERFILDOCUMENTAL', nullable: true })
  idperfildocumental: number | null;

  @Column('int', { name: 'IDDOCUMENTO', nullable: true })
  iddocumento: number | null;

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

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
