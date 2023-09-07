import { Assets, Token } from "@marlowe.io/runtime-core";

export function* intersperse(a: string[], delim: string) {
  let first = true;
  for (const x of a) {
    if (!first) yield delim;
    first = false;
    yield x;
  }
}

export const formatAssets = (assets: Assets, isMainnnet: Boolean): string[] => {
  const [adas, lovelaces, currency] = formatADAs(assets.lovelaces, isMainnnet)
  const formattedADA = lovelaces === '000000' ? adas + ' ' + currency : adas + '.' + lovelaces + ' ' + currency
  return [formattedADA].concat(assets.tokens.map((tk: Token) => `${tk.quantity} ${tk.assetId.assetName}`))
}

export type CurrencyF = String
export type WholeNumberF = string
export type DecimalF = string
const formatADAs = (lovelaces: bigint, isMainnet: Boolean = false, currencyName: string = "₳"): [WholeNumberF, DecimalF, CurrencyF] => {
  const adas = (Math.trunc(Number(lovelaces).valueOf() / 1_000_000))
  const decimalADAs = (lovelaces % 1_000_000n)
  const currency = isMainnet ? currencyName : "t" + currencyName
  return [adas.toString(), decimalADAs.toString().padStart(6, '0'), currency]
}

export const shortViewTxOutRef = (txOutRef: string) => txOutRef.substring(txOutRef.length - 6);