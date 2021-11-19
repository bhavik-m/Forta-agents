import BigNumber from 'bignumber.js'

import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType
} from 'forta-agent'

let findingsCount = 0

const INSTADAPP_GOVERNANCE_ADDRESS = '0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B'

// An event emitted when a proposal has been canceled
const PROPOSAL_CANCEL_SIGNATURE = 'ProposalCanceled(uint)'

// An event emitted when a proposal has been queued
const PROPOSAL_QUEUED_SIGNATURE = 'ProposalQueued(uint, uint)'

// An event emitted when a proposal has been executed
const PROPOSAL_EXECUTED_SIGNATURE = 'ProposalExecuted(uint)'

export const events: any = {
  QUEUE: PROPOSAL_QUEUED_SIGNATURE,
  EXECUTE: PROPOSAL_EXECUTED_SIGNATURE,
  CANCEL: PROPOSAL_CANCEL_SIGNATURE,
}


const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = []

  for (let event in events) {
    const logs = txEvent.filterEvent(events[event], INSTADAPP_GOVERNANCE_ADDRESS)

    if (!logs.length) continue

    if (!txEvent.status) {
      findings.push(
        Finding.fromObject({
          name: 'INSTADAPP GOVERNANCE PROPOSAL',
          description: `Failed ${event} Proposal event is detected.`,
          alertId: 'Instadapp-11',
          protocol: 'Instadapp',
          type: FindingType.Suspicious,
          severity: FindingSeverity.High,
        })
      )
    } else {
      findings.push(
        Finding.fromObject({
          name: 'INSTADAPP GOVERNANCE PROPOSAL',
          description: `${event} Proposal Event is detected.`,
          alertId: 'Instadapp-12',
          protocol: 'Instadapp',
          type: FindingType.Unknown,
          severity: FindingSeverity.Info,
        })
      )
    }
  }

  return findings
}

// const handleBlock: HandleBlock = async (blockEvent: BlockEvent) => {
//   const findings: Finding[] = [];
//   // detect some block condition
//   return findings;
// }

export default {
  handleTransaction,
  // handleBlock
}