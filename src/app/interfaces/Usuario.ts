import { Rol } from "./Rol";

export interface Usuario{
  usuarioId?:number,
  nombre:string,
  email:string,
  contrasena:string,
  nombreUsuario:string,
  fechaRegistro:string,
  rols?:Rol
}
