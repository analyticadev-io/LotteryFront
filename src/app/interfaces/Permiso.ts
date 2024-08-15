import { Rol } from "./Rol";

export interface Permiso{
  permisoId?:number,
  descripcion:string,
  rols?:Rol[]
  checked?:boolean
}
