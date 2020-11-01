import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_43', ['idaceptacion'], {})
@Entity('tperfildocumental', { schema: 'Proveedores_test' })
export class Tperfildocumental {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDACEPTACION', nullable: true })
  idaceptacion: number | null;

  @Column('bit', { name: 'SIDECLARO', nullable: true })
  sideclaro: boolean | null;

  @Column('bit', { name: 'SIAUTORIZO', nullable: true })
  siautorizo: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('decimal', {
    name: 'PESO',
    nullable: true,
    comment:
      'es la suma de los de cada uno de los pesos de los documentos subidos, que toma el valor del peso de tdocumento',
    precision: 3,
    scale: 2,
  })
  peso: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
