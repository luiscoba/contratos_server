import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ttipoperfil', { schema: 'Proveedores_test' })
export class Ttipoperfil {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('varchar', { name: 'NOMBRE', nullable: true, length: 25 })
  nombre: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
