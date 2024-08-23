import { Rol } from "./Rol";

export interface Permiso{
  PermisoId?:number,
  Descripcion:string,
  rols?:Rol[]
  checked?:boolean
}
