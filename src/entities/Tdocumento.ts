import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tdocumento', { schema: 'Proveedores_test' })
export class Tdocumento {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('varchar', {
    name: 'NOMBRE',
    nullable: true,
    comment:
      'Es el titulo de la peticion del archivo, es el texto que se va a mostrar para solicitar el archivo',
    length: 150,
  })
  nombre: string | null;

  @Column('int', {
    name: 'NUMERO',
    nullable: true,
    comment: 'es el numero de archivos que debe de subir',
  })
  numero: number | null;

  @Column('decimal', { name: 'PESO', nullable: true, precision: 3, scale: 2 })
  peso: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
