import { Contract, Role, Timeout, TokenValue } from "@marlowe.io/language-core-v1"
import { AddressBech32,unAddressBech32 } from "@marlowe.io/runtime-core"



export type GeneratePayoutRequest = {
    provider : AddressBech32
    claimer : Role
    tokenValue : TokenValue
    deadline : Timeout
}

export function mkContract(request : GeneratePayoutRequest) : Contract {
    return {
      when : [
        {
          case : {
            party : {
              address : unAddressBech32(request.provider)
            }
          , deposits : request.tokenValue.amount
          , of_token : request.tokenValue.token
          , into_account : request.claimer
          }
        , then : "close"
        }
      ]
    , timeout : request.deadline
    , timeout_continuation : "close"
    }
  }
  