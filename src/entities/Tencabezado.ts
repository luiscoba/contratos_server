import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_33', ['idusuariosistema'], {})
@Entity('tencabezado', { schema: 'Proveedores_test' })
export class Tencabezado {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDUSUARIOSISTEMA', nullable: true })
  idusuariosistema: number | null;

  @Column('date', { name: 'FPEDIDOCALIFICACION', nullable: true })
  fpedidocalificacion: string | null;

  @Column('date', { name: 'FRECEPCIONDOCUMENTACION', nullable: true })
  frecepciondocumentacion: string | null;

  @Column('date', { name: 'FENTREGADOCUMENTACIONCOMPLETA', nullable: true })
  fentregadocumentacioncompleta: string | null;

  @Column('bit', { name: 'DOCUMENTACIONENTREGADA', nullable: true })
  documentacionentregada: boolean | null;

  @Column('varchar', { name: 'OBSERVACION', nullable: true, length: 1000 })
  observacion: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
