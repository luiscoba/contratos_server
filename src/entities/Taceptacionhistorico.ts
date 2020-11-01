import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('taceptacionhistorico', { schema: 'Proveedores_test' })
export class Taceptacionhistorico {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDACEPTACION', nullable: true })
  idaceptacion: number | null;

  @Column('varchar', { name: 'DECLARACION', nullable: true, length: 2000 })
  declaracion: string | null;

  @Column('varchar', { name: 'AUTORIZACION', nullable: true, length: 2000 })
  autorizacion: string | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
