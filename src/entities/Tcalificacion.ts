import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tcalificacion', { schema: 'Proveedores_test' })
export class Tcalificacion {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'RANGO', nullable: true })
  rango: number | null;

  @Column('varchar', { name: 'CALIFICACION', nullable: true, length: 20 })
  calificacion: string | null;

  @Column('varchar', { name: 'RIESGO', nullable: true, length: 20 })
  riesgo: string | null;

  @Column('varchar', { name: 'RESULTADO', nullable: true, length: 100 })
  resultado: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
