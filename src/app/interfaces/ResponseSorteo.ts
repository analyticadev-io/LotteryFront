export interface ResponseSorteo{
  SorteoId?: number,
  FechaSorteo?: string,
  Title?:string,
  Descripcion?:string,
  status?:string,
  Boletos?: any[],
  NumerosSorteos?: any[]
}
