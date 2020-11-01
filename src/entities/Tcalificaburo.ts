import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tcalificaburo', { schema: 'Proveedores_test' })
export class Tcalificaburo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'INDICE', nullable: true })
  indice: number | null;

  @Column('varchar', { name: 'COLOR', nullable: true, length: 20 })
  color: string | null;

  @Column('int', { name: 'PORCENTAJE', nullable: true })
  porcentaje: number | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
