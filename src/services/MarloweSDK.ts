type Wallet = {
  enable: () => Promise<any>;
  getChangeAddress: () => Promise<string>;
};

class MarloweSDK {
  validWalletNames: string[];
  connectedWallet: Wallet | null;
  lovelaceBalance: number;
  changeAddress: string | null;
  payouts: any[];

  constructor() {
    this.validWalletNames = [
      'nami',
      'eternl',
      'flint',
      'gerowallet',
      'yoroi',
      'lace',
    ];
    this.connectedWallet = null;
    this.lovelaceBalance = 125000000;
    this.changeAddress = null;
    const tokens1 = [
      { id: 1, tokenName: "TokenA", currencySymbol: "TA", amount: 100 },
      { id: 2, tokenName: "TokenB", currencySymbol: "TB", amount: 200 }
    ];

    const tokens2 = [
      { id: 3, tokenName: "TokenC", currencySymbol: "TC", amount: 300 },
      { id: 4, tokenName: "TokenD", currencySymbol: "TD", amount: 400 }
    ];

    const payout1 = {
      id: 1,
      name: "Payout1",
      iconImage: "/path/to/payout1-icon.jpg",
      roleToken: "RoleToken1",
      actionLabel: "Withdraw",
      tokens: [tokens1, tokens2]
    };

    const payout2 = {
      id: 2,
      name: "Payout2",
      iconImage: "/path/to/payout2-icon.jpg",
      roleToken: "RoleToken2",
      actionLabel: "Withdraw",
      tokens: [tokens1, tokens2]
    };

    const payouts = [payout1, payout2];

    this.payouts = payouts;

  }

  getPayouts() {
    return this.payouts;
  }

  getConnectedWallet(): Wallet | null {
    return this.connectedWallet;
  }

  async setChangeAddress(): Promise<void> {
    if (this.connectedWallet) {
      this.changeAddress = await this.connectedWallet.getChangeAddress();
    }
  }

  async connectWallet(walletName: string): Promise<void> {
    console.log(`Connecting to ${walletName}`)
    try {
      if (this.validWalletNames.includes(walletName)) {
        const wallet = await (window as any).cardano[walletName].enable();
        this.connectedWallet = wallet;
        await this.setChangeAddress();
      } else {
        console.log(
          `Please select from accepted wallets ${this.validWalletNames.join(', ')}`
        );
      }
    } catch (e) {
      console.log("FAILED TO CONNECT WALLET: ", e);
    }

  }

  disconnectWallet(): void {
    this.connectedWallet = null;
  }

  getLovelaceBalance(): Promise<number> {
    return Promise.resolve(this.lovelaceBalance);
  }
}

export default MarloweSDK;
