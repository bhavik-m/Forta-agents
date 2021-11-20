import BigNumber from 'bignumber.js'

import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType
} from 'forta-agent'

const INSTADAPP_IMPLEMENTATION_ADDRESS = '0xCBA828153d3a85b30B5b912e1f2daCac5816aE9D'

const SET_DEFAULT_IMPLEMENTATION = 'LogSetDefaultImplementation(address, address)'

const ADD_IMPLEMENTATION = 'LogAddImplementation(address, bytes4[])'

const REMOVE_IMPLEMENTATION = 'LogRemoveImplementation(address, bytes4[])'


const events: any = {
  SET_DEFAULT: SET_DEFAULT_IMPLEMENTATION,
  ADD: ADD_IMPLEMENTATION,
  REMOVE: REMOVE_IMPLEMENTATION,
}

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = []

  for (let event in events) {
    const logs = txEvent.filterEvent(events[event], INSTADAPP_IMPLEMENTATION_ADDRESS)

    if (!logs.length) continue

    if (!txEvent.status) {
      findings.push(
        Finding.fromObject({
          name: 'INSTADAPP IMPLEMENTATION CONTRACT',
          description: `Failed ${event}  event is detected.`,
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

export default {
  handleTransaction,
  // handleBlock
}