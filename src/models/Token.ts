export default class Token {
  id: string;
  tokenName: string;
  currencySymbol: string;
  amount: bigint;

  constructor(id: string, tokenName: string, currencySymbol: string, amount: bigint) {
    this.id = id;
    this.tokenName = tokenName;
    this.currencySymbol = currencySymbol;
    this.amount = amount;
  }
}

