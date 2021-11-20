import BigNumber from 'bignumber.js'
import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from 'forta-agent'
import { INSTADAPP_GOVERNANCE_ADDRESS, Sigs } from './utils'

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = []

  for (let sig in Sigs) {
    const logs = txEvent.filterEvent(Sigs[sig], INSTADAPP_GOVERNANCE_ADDRESS)

    if (!logs.length) continue

    if (!txEvent.status) {
      findings.push(
        Finding.fromObject({
          name: 'INSTADAPP GOVERNANCE EVENT',
          description: `INSTADAPP Failed ${sig} Proposal event is detected.`,
          alertId: 'INSTADAPP-11',
          protocol: 'INSTADAPP',
          type: FindingType.Suspicious,
          severity: FindingSeverity.High,
        })
      )
    } else {
      findings.push(
        Finding.fromObject({
          name: 'INSTADAPP GOVERNANCE EVENT',
          description: `INSTADAPP ${sig} Proposal Event is detected.`,
          alertId: 'INSTADAPP-12',
          protocol: 'INSTADAPP',
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
}
