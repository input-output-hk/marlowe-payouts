import Token from "./Token";

export default class Payout {
  payoutId: string;
  contractId: string;
  role: Token;
  tokens: Token[]

  constructor(payoutId: string, contractId: string, role: Token, tokens: Token[]) {
    this.payoutId = payoutId;
    this.contractId = contractId;
    this.role = role;
    this.tokens = tokens;
  }
}
