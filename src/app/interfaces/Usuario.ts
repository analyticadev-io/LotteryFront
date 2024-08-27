import { Rol } from "./Rol";

export interface Usuario{
  UsuarioId?:number,
  Nombre:string,
  email:string,
  contrasena:string,
  nombreUsuario:string,
  fechaRegistro:string,
  Rol?:Rol[]
}
