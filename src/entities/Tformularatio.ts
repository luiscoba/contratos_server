import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_59', ['idtiporatio'], {})
@Entity('tformularatio', { schema: 'Proveedores_test' })
export class Tformularatio {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDTIPORATIO', nullable: true })
  idtiporatio: number | null;

  @Column('varchar', {
    name: 'NOMBRE',
    nullable: true,
    comment:
      'Aquí va la formula que se aplicará para el cálculo de los ratios. Se calcula con el id de cuenta',
    length: 150,
  })
  nombre: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
