import { Permiso } from './Permiso';
import { Usuario } from './Usuario';
export interface Rol {
  RolId?:number,
  Nombre:string,
  Permisos?:Permiso[],
  Usuarios?:Usuario[]
}
