import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ttipoproveedor', { schema: 'Proveedores_test' })
export class Ttipoproveedor {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('varchar', { name: 'NOMBRE', nullable: true, length: 20 })
  nombre: string | null;

  @Column('varchar', { name: 'CODIGO', nullable: true, length: 50 })
  codigo: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
