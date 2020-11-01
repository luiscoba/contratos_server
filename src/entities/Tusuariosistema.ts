import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';

@Entity("tusuariosistema", { schema: "Proveedores_test" })
export class Tusuariosistema {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("varchar", { name: "USUARIO", nullable: true, length: 20 })
  usuario: string | null;

  @Column("varchar", { name: "NOMBRE", nullable: true, length: 20 })
  nombre: string | null;

  @Column("varchar", { name: "APELLIDOS", nullable: true, length: 40 })
  apellidos: string | null;

  @Column("varchar", {
    name: "CLAVE",
    nullable: true,
    comment:
      "la generacion de claves es encriptada por ese debe tener mucha longitud la clave",
    length: 100,
  })
  clave: string | null;

  @Column("bit", { name: "USACLAVETEMPORAL", nullable: true })
  usaclavetemporal: boolean | null;

  @Column("varchar", { name: "CLAVETEMPORAL", nullable: true, length: 100 })
  clavetemporal: string | null;

  @Column("datetime", { name: "FECHACADUCACLAVETEMP", nullable: true })
  fechacaducaclavetemp: Date | null;

  @Column("varchar", { name: "CORREO", nullable: true, length: 40 })
  correo: string | null;

  @Column("varchar", { name: "TELEFONO", nullable: true, length: 15 })
  telefono: string | null;

  @Column("varchar", { name: "ESTADO", nullable: true, length: 15 })
  estado: string | null;

  @Column("date", { name: "FECHAREGISTRO", nullable: true })
  fecharegistro: string | null;

  @Column("varchar", { name: "RESPONSABLE", nullable: true, length: 50 })
  responsable: string | null;


  hashPassword(): void {
    const salt = bcrypt.genSaltSync(10);
    this.clave = bcrypt.hashSync(this.clave, salt);
  }

  hashPasswordTemporal(): void {
    const salt = bcrypt.genSaltSync(10);
    this.clavetemporal = bcrypt.hashSync(this.clavetemporal, salt);
  }

  checkPassword(clave: string): boolean {
    return bcrypt.compareSync(clave, this.clave);
  }

  checkPasswordTemporal(claveTemporal: string): boolean {
    return bcrypt.compareSync(claveTemporal, this.clavetemporal);
  }
}

