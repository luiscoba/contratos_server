import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tperfilsistema', { schema: 'Proveedores_test' })
export class Tperfilsistema {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'CODIGO', nullable: true })
  codigo: number | null;

  @Column('varchar', { name: 'NOMBRE', nullable: true, length: 20 })
  nombre: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
