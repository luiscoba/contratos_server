import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// 
@Entity('taceptacion', { schema: 'Proveedores_test' })
export class Taceptacion {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('varchar', { name: 'DECLARACION', nullable: true, length: 2000 })
  declaracion: string | null;

  @Column('varchar', { name: 'AUTORIZACION', nullable: true, length: 2000 })
  autorizacion: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;
}
