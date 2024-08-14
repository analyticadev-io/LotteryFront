import { Permiso } from './Permiso';
import { Usuario } from './Usuario';
export interface Rol {
  rolId?:number,
  nombre:string,
  permisos?:Permiso[],
  usuarios?:Usuario[]
}
