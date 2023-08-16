import { Blockfrost, Lucid } from "lucid-cardano";
import Token from "../models/Token";
import Payout from "../models/Payout";

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
  lucid: Lucid | null;

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
      new Token(1, "TokenA", "TA", 100),
      new Token(2, "TokenB", "TB", 200)
    ];

    const tokens2 = [
      new Token(3, "TokenC", "TC", 300),
      new Token(4, "TokenD", "TD", 400)
    ];

    const payout1 = new Payout(
      1,
      "Payout1",
      "/path/to/payout1-icon.jpg",
      "RoleToken1",
      "Withdraw",
      [tokens1]
    );

    const payout2 = new Payout(
      2,
      "Payout2",
      "/path/to/payout2-icon.jpg",
      "RoleToken2",
      "Withdraw",
      [tokens2]
    );

    const payouts = [payout1, payout2];

    this.payouts = payouts;

    this.lucid = null;

  }

  getPayouts() {
    return this.payouts;
  }

  getConnectedWallet(): Wallet | null {
    return this.connectedWallet;
  }

  getLucid(): Lucid | null {
    return this.lucid;
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
        const lucid = await Lucid.new(
          new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", "previewGstJmKGkWEnJetz8heF9Gfs6q4FbOvc0"),
          "Preview",
        );
        const wallet = await (window as any).cardano[walletName].enable();
        lucid.selectWallet(wallet);
        this.lucid = lucid;
        this.connectedWallet = wallet;
        console.log(lucid);
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

  async withdraw(id:string): Promise<void> {
    try {
      const lucid = this.getLucid();
      // const changeAddress = this.changeAddress;
      const changeAddress = "addr_test1qqc3suxnrnsejezh8yzg3qzfupxqn65v5dem2rpnmr60rvgv2ckqzwjtp8w854ua4rd3udc08y5hlnxz82xhml96967saa9fdr";
      if (lucid && changeAddress) {
        console.log(`Withdrawing ${id}`);
        console.log("LUCID FROM STATE: ", lucid);
        console.log("CHANGE ADDRESS: ", changeAddress)
        const tx = await lucid.newTx()
          .payToAddress(changeAddress, { lovelace: 5000000n })
          .payToAddress(changeAddress, { lovelace: 5000000n })
          .complete();

        console.log("TX: ", tx);
        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();
        console.log("TX HASH: ", txHash);
      }
    } catch (e) {
      console.log("ERROR CREATING TX: ", e)
    }
  }
}

export default MarloweSDK;
