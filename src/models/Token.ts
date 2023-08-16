export default class Token {
  id: number;
  tokenName: string;
  currencySymbol: string;
  amount: number;

  constructor(id: number, tokenName: string, currencySymbol: string, amount: number) {
    this.id = id;
    this.tokenName = tokenName;
    this.currencySymbol = currencySymbol;
    this.amount = amount;
  }
}

