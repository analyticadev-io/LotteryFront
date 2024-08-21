export interface ResponseSorteo{
  sorteoId?: number,
  fechaSorteo?: string,
  descripcion?:string,
  status?:string,
  boletos?: any[],
  numerosSorteos?: any[]
}
