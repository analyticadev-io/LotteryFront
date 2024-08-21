import { Usuario } from "./Usuario";

export interface Token {
  token: string;
  usuario: Usuario;
}

export interface DecryptedResponse {
  isSuccess: boolean;
  token: Token;
}
