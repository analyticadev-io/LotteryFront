import { Rol } from "./Rol";

export interface Usuario{
  usuarioId?:number,
  Nombre:string,
  email:string,
  contrasena:string,
  nombreUsuario:string,
  fechaRegistro:string,
  Rol?:Rol[]
}
