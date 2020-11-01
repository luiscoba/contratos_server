import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tlog', { schema: 'Proveedores_test' })
export class Tlog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  @Column('datetime', { name: 'FECHAREGISTRO', nullable: true })
  fecharegistro: Date | null;

  @Column('datetime', { name: 'FECHAFINAL', nullable: true })
  fechafinal: Date | null;

  @Column('varchar', { name: 'APLICACION', nullable: true, length: 20 })
  aplicacion: string | null;

  @Column('varchar', { name: 'SERVICIOWEB', nullable: true, length: 50 })
  servicioweb: string | null;

  @Column('varchar', { name: 'MENSAJE', nullable: true, length: 2000 })
  mensaje: string | null;

  @Column('varchar', { name: 'CORRELACION', nullable: true, length: 100 })
  correlacion: string | null;

  @Column('varchar', { name: 'RESPONSABLE', nullable: true, length: 30 })
  responsable: string | null;
}
