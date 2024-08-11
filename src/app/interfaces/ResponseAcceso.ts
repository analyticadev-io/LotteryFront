import { Usuario } from "./Usuario";

export interface Token {
  token: string;
  usuario: Usuario;
}

export interface ResponseAcceso {
  isSuccess: boolean;
  token: Token;
}
