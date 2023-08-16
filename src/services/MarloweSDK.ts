type Wallet = {
  enable: () => Promise<any>;
  getChangeAddress: () => Promise<string>;
};

class MarloweSDK {
  validWalletNames: string[];
  connectedWallet: Wallet | null;
  lovelaceBalance: number;
  changeAddress: string | null;

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
