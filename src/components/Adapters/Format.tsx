import { AssetId, Assets, PayoutId, Token, payoutIdToTxId, unPayoutId, unPolicyId } from "@marlowe.io/runtime-core";
import React, {  } from 'react';
import { ContractId, unContractId } from "@marlowe.io/runtime-core"


export function* intersperse(a: string[], delim: string) {
  let first = true;
  for (const x of a) {
    if (!first) yield delim;
    first = false;
    yield x;
  }
}

export function contractIdLink (marloweScanURL : string , contractId : ContractId) {
  return <a target="_blank"
   rel="noopener noreferrer"
   href={`${marloweScanURL}/contractView?tab=info&contractId=` + encodeURIComponent(unContractId(contractId))}>
   {truncateAddress(unContractId(contractId))}<span style={{fontSize:"small"}}>#</span> </a> 
 }

 export function payoutTxLink (cardanoScanURL : string , payoutId : PayoutId) {
  return <a target="_blank"
   rel="noopener noreferrer"
   href={`${cardanoScanURL}/transaction/` + encodeURIComponent(payoutIdToTxId(payoutId))}>
   {truncateId(payoutIdToTxId(payoutId))}<span style={{fontSize:"small"}}>#</span> </a> 
 }

 export function roleTokenLink (cardanoScanURL : string , roleToken : AssetId) {
  return <a target="_blank"
   rel="noopener noreferrer"
   href={`${cardanoScanURL}/tokenPolicy/` + encodeURIComponent(unPolicyId(roleToken.policyId))}>
   {roleToken.assetName}</a> 
 }

const truncateId = (str: string) => {
  const length = str.length;
  return str.slice(length-64, length-59)
}

const truncateAddress = (str: string) => {
  const length = str.length;
  return str.slice(length-66, length-61)
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

export const cssOverrideSpinnerCentered 
  = ({display: "block",
      marginLeft: "10px",
      marginRight:"auto",
      height: "auto",
      witdth : "20px",
      paddingTop: "10px"})