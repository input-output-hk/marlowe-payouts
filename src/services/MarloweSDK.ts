import { Blockfrost, Lucid } from "lucid-cardano";
import {RuntimeBrowser} from "@marlowe.io/runtime"
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
  lovelaceBalance: bigint;
  changeAddress: string | null;
  payouts: any[];
  lucid: Lucid | null;
  runtimeSettings: any;
  runtimeBrowser: any;

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
    this.lovelaceBalance = 125000000n;
    this.changeAddress = null;
    const tokens1 = [
      new Token('1', "TokenA", "TA", 3000000n),
      new Token('2', "TokenB", "TB", 2000000n)
    ];

    const tokens2 = [
      new Token('3', "TokenC", "TC", 3000000n),
      new Token('4', "TokenD", "TD", 2000000n),
    ];

    const roleToken1 = new Token('5', "RoleToken1", "RT1", 1n)
    const roleToken2 = new Token('6', "RoleToken2", "RT2", 1n)
    const roleToken3 = new Token('7', "RoleToken2", "RT2", 1n)
    const roleToken4 = new Token('8', "RoleToken2", "RT2", 1n)

    const payout1 = new Payout(
      'payoutID1',
      "contractID1",
      roleToken1,
      tokens1
    );

    const payout2 = new Payout(
      "PayoutID2",
      "contractID1",
      roleToken2,
      tokens2
    );

    const payout3 = new Payout(
      "PayoutID3",
      "contractID1",
      roleToken3,
      tokens2
    );

    const payout4 = new Payout(
      "PayoutID4",
      "contractID1",
      roleToken4,
      tokens2
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
      this.changeAddress = await this.runtimeBrowser.wallet.getChangeAddress();
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
        
        this.runtimeBrowser = await RuntimeBrowser.mkRuntimeBroswer(`https://marlowe-runtime-preview-web.scdev.aws.iohkdev.io`)(walletName)()

        E.match(
          (err) => console.log("runtimeBrowser erro", err),
          (lovelaceBalance) => console.log("runtimeBrowser", lovelaceBalance)
        ) (this.runtimeBrowser)
        
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

  getLovelaceBalance(): Promise<bigint> {
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
        const amount = payout.tokens.map((token: Token) => token.amount).reduce((a, b) => a + b, 0n);
        console.log("amount", amount);
        tx = await tx.payToAddress(destinationAddress, { lovelace: amount })
      })

      const completeTransaction = await tx.complete();

      const signedTx = await completeTransaction.sign().complete();
      const txHash = await signedTx.submit();
      successCallback();
    }
  }
}

export default MarloweSDK;
