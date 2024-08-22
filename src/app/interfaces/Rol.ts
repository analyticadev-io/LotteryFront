import { Permiso } from './Permiso';
import { Usuario } from './Usuario';
export interface Rol {
  rolId?:number,
  nombre:string,
  Permisos?:Permiso[],
  usuarios?:Usuario[]
}
