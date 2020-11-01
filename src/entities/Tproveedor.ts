import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('FK_REFERENCE_35', ['idencabezado'], {})
@Index('FK_REFERENCE_45', ['idperfilempresarial'], {})
@Index('FK_REFERENCE_46', ['idinformacioncontacto'], {})
@Index('FK_REFERENCE_50', ['idperfilfinanciero'], {})
@Index('FK_REFERENCE_51', ['ididentificacionproveedor'], {})
@Index('FK_REFERENCE_64', ['idcalificacion'], {})
@Index('FK_REFERENCE_66', ['idperfildocumental'], {})
@Index('FK_USUARIO_SIS_PROV', ['idusuariosistema'], {})
@Entity('tproveedor', { schema: 'Proveedores_test' })
export class Tproveedor {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('int', { name: 'IDUSUARIOSISTEMA', nullable: true })
  idusuariosistema: number | null;

  @Column('int', { name: 'IDENCABEZADO', nullable: true })
  idencabezado: number | null;

  @Column('int', { name: 'IDPERFILEMPRESARIAL', nullable: true })
  idperfilempresarial: number | null;

  @Column('int', { name: 'IDPERFILFINANCIERO', nullable: true })
  idperfilfinanciero: number | null;

  @Column('int', { name: 'IDIDENTIFICACIONPROVEEDOR', nullable: true })
  ididentificacionproveedor: number | null;

  @Column('int', { name: 'IDCALIFICACION', nullable: true })
  idcalificacion: number | null;

  @Column('int', { name: 'IDINFORMACIONCONTACTO', nullable: true })
  idinformacioncontacto: number | null;

  @Column('int', { name: 'IDPERFILDOCUMENTAL', nullable: true })
  idperfildocumental: number | null;

  @Column('decimal', {
    name: 'PESOTOTAL',
    nullable: true,
    precision: 3,
    scale: 2,
  })
  pesototal: string | null;

  @Column('decimal', {
    name: 'CALIFICACIONBURO',
    nullable: true,
    precision: 3,
    scale: 2,
  })
  calificacionburo: string | null;

  @Column('decimal', {
    name: 'CALIFICACIONTOTAL',
    nullable: true,
    precision: 3,
    scale: 2,
  })
  calificaciontotal: string | null;

  @Column('bit', { name: 'ESTADO', nullable: true })
  estado: boolean | null;

  @Column('date', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 50 })
  responsable: string | null;
}
