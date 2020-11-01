import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_47', ['idparroquia'], {})
@Entity('tinformacioncontacto', { schema: 'Proveedores_test' })
export class Tinformacioncontacto {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDPARROQUIA', nullable: true })
  idparroquia: number | null;

  @Column('varchar', { name: 'DIRECCION', nullable: true, length: 200 })
  direccion: string | null;

  @Column('varchar', { name: 'TELEFONO', nullable: true, length: 15 })
  telefono: string | null;

  @Column('varchar', { name: 'CELULAR', nullable: true, length: 15 })
  celular: string | null;

  @Column('varchar', { name: 'MAILPROVEEDOR', nullable: true, length: 50 })
  mailproveedor: string | null;

  @Column('varchar', { name: 'CONTACTOCOMERCIAL', nullable: true, length: 50 })
  contactocomercial: string | null;

  @Column('varchar', {
    name: 'TELEFONOCONTACTOCOMERCIAL',
    nullable: true,
    length: 15,
  })
  telefonocontactocomercial: string | null;

  @Column('varchar', { name: 'CELULAR1', nullable: true, length: 15 })
  celular1: string | null;

  @Column('varchar', { name: 'MAIL1', nullable: true, length: 15 })
  mail1: string | null;

  @Column('varchar', { name: 'CELULAR2', nullable: true, length: 15 })
  celular2: string | null;

  @Column('varchar', { name: 'MAIL2', nullable: true, length: 15 })
  mail2: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
