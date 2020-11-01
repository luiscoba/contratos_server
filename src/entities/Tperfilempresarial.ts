import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tperfilempresarial', { schema: 'Proveedores_test' })
export class Tperfilempresarial {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('date', { name: 'FECHAAPERTURARUC', nullable: true })
  fechaaperturaruc: string | null;

  @Column('varchar', {
    name: 'ACTIVIDADECONOMICAPRINCIPAL',
    nullable: true,
    length: 200,
  })
  actividadeconomicaprincipal: string | null;

  @Column('varchar', {
    name: 'ACTIVIDADECONOMICASECUNDARIA',
    nullable: true,
    length: 200,
  })
  actividadeconomicasecundaria: string | null;

  @Column('decimal', { name: 'PESO', nullable: true, precision: 3, scale: 2 })
  peso: string | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
