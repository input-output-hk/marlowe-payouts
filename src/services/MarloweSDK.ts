import { Blockfrost, Lucid } from "lucid-cardano";
import {RuntimeBrowser} from "@marlowe.tmp/legacy-runtime"
import Token from "../models/Token";
import Payout from "../models/Payout";
import * as E from "fp-ts/Either"
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
      5000000n,
      "/path/to/payout1-icon.jpg",
      "RoleToken1",
      "Withdraw",
      [tokens1]
    );

    const payout2 = new Payout(
      2,
      "Payout2",
      3000000n,
      "/path/to/payout2-icon.jpg",
      "RoleToken2",
      "Withdraw",
      [tokens2]
    );

    const payout3 = new Payout(
      3,
      "Payout3",
      23000000n,
      "/path/to/payout3-icon.jpg",
      "RoleToken3",
      "Withdraw",
      [tokens2]
    );


    const payout4 = new Payout(
      4,
      "Payout4",
      97000000n,
      "/path/to/payout4-icon.jpg",
      "RoleToken4",
      "Withdraw",
      [tokens2]
    );


    const payouts = [payout1, payout2, payout3, payout4];

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
        
        const runtimeBrowser = await RuntimeBrowser.mkRuntimeCIP30(`http://localhost:4040`)(walletName)()
        const result : E.Either<ErrorOptions,bigint> = await runtimeBrowser.wallet.getLovelaces()
        E.match(
          (err) => console.log("runtimeBrowser erro", err),
          (lovelaceBalance) => console.log("runtimeBrowser", lovelaceBalance)
        ) (result)
        
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

  getDestinationAddress(): string {
    // return "addr_test1qqc3suxnrnsejezh8yzg3qzfupxqn65v5dem2rpnmr60rvgv2ckqzwjtp8w854ua4rd3udc08y5hlnxz82xhml96967saa9fdr";
    return "addr_test1qrtwu0c4lpfpfd89d8j0mvxrznx3ypa30cafhzure0ufc9w6vhc3ts2pccnuqxp25a0nfhdm94z89tu2qj325hkema2sg659ex";
  }

  async withdrawPayouts(payouts:Payout[], successCallback:any): Promise<void> {
    const lucid = this.getLucid();
    const destinationAddress = this.getDestinationAddress();
    if (lucid && destinationAddress) {
      let tx = await lucid.newTx()

      payouts.forEach(async (payout) => {
        tx = await tx.payToAddress(destinationAddress, { lovelace: payout.amount })
      })

      const completeTransaction = await tx.complete();

      const signedTx = await completeTransaction.sign().complete();
      const txHash = await signedTx.submit();
      successCallback();
    }
  }
}

export default MarloweSDK;
