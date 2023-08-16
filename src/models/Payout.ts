import Token from "./Token";

export default class Payout {
  id: number;
  name: string;
  iconImage: string;
  roleToken: string;
  actionLabel: string;
  tokens: Token[][];

  constructor(id: number, name: string, iconImage: string, roleToken: string, actionLabel: string, tokens: Token[][]) {
    this.id = id;
    this.name = name;
    this.iconImage = iconImage;
    this.roleToken = roleToken;
    this.actionLabel = actionLabel;
    this.tokens = tokens;
  }
}
