import {
  TransactionEvent,
  FindingType,
  FindingSeverity,
  Finding,
  EventType,
  Network,
  HandleTransaction,
} from 'forta-agent'

import agent from '.'
import {
  INSTADAPP_CONNECTOR_ADDRESS,
  UPDATED_CONNECTOR,
  ADDED_CONNECTOR,
  REMOVED_CONNECTOR,
  TOPICS,
  generateHash,
} from './utils'

describe('Detect Instadapp Contract event Event', () => {
  let handleTransaction: HandleTransaction

  const createTxEvent = ({
    logs,
    addresses,
    status = true,
  }: any): TransactionEvent => {
    const tx: any = {}
    const receipt: any = { logs, status }
    const block: any = {}
    const address: any = { ...addresses }

    return new TransactionEvent(
      EventType.BLOCK,
      Network.MAINNET,
      tx,
      receipt,
      [],
      address,
      block
    )
  }

  beforeAll(() => {
    handleTransaction = agent.handleTransaction
  })

  describe('Handle Transaction', () => {
    it('should return empty finding', async () => {
      const GovEvent = {
        topics: [],
        address: INSTADAPP_CONNECTOR_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })
      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([])
    })

    it('should return empty finding - wrong address', async () => {
      const topicHash: string = generateHash(ADDED_CONNECTOR)

      const GovEvent = {
        topics: [topicHash],
        address: '0x01',
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })
      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([])
    })

    it('should return empty finding - empty address', async () => {
      const topicHash: string = generateHash(ADDED_CONNECTOR)

      const GovEvent = {
        topics: [topicHash],
        address: '',
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })
      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([])
    })


  })

  describe('Successed CONNECTOR Transactions', () => {
    it('should return Added Event finding', async () => {
      const topicHash: string = generateHash(ADDED_CONNECTOR)

      const GovEvent = {
        topics: [topicHash],
        address: INSTADAPP_CONNECTOR_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: 'INSTADAPP CONNECTOR EVENT',
          description: `Instadapp ${TOPICS.ADDED} Connector Event is detected.`,
          alertId: 'INSTADAPP-16',
          protocol: 'INSTADAPP',
          type: FindingType.Unknown,
          severity: FindingSeverity.Info,
        }),
      ])
    })

    it('should return Updated Event finding', async () => {
      const topicHash: string = generateHash(UPDATED_CONNECTOR)

      const GovEvent = {
        topics: [topicHash],
        address: INSTADAPP_CONNECTOR_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: 'INSTADAPP CONNECTOR EVENT',
          description: `Instadapp ${TOPICS.UPDATED} Connector Event is detected.`,
          alertId: 'INSTADAPP-16',
          protocol: 'INSTADAPP',
          type: FindingType.Unknown,
          severity: FindingSeverity.Info,
        }),
      ])
    })

    it('should return Removed Event finding', async () => {
      const topicHash: string = generateHash(REMOVED_CONNECTOR)

      const GovEvent = {
        topics: [topicHash],
        address: INSTADAPP_CONNECTOR_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: 'INSTADAPP CONNECTOR EVENT',
          description: `Instadapp ${TOPICS.REMOVED} Connector Event is detected.`,
          alertId: 'INSTADAPP-16',
          protocol: 'INSTADAPP',
          type: FindingType.Unknown,
          severity: FindingSeverity.Info,
        }),
      ])
    })
  })

  describe('Failed connector Transactions', () => {
    it('should return Failed Added CONNECTOR Event finding', async () => {
      const topicHash: string = generateHash(ADDED_CONNECTOR)

      const GovEvent = {
        topics: [topicHash],
        address: INSTADAPP_CONNECTOR_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
        status: false,
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: 'INSTADAPP CONNECTOR EVENT',
          description: `Instadapp Failed ${TOPICS.ADDED} Connector event is detected.`,
          alertId: 'INSTADAPP-15',
          protocol: 'INSTADAPP',
          type: FindingType.Suspicious,
          severity: FindingSeverity.High,
        }),
      ])
    })

    it('should return Failed Updated CONNECTOR Event finding', async () => {
      const topicHash: string = generateHash(UPDATED_CONNECTOR)

      const GovEvent = {
        topics: [topicHash],
        address: INSTADAPP_CONNECTOR_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
        status: false,
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: 'INSTADAPP CONNECTOR EVENT',
          description: `Instadapp Failed ${TOPICS.UPDATED} Connector event is detected.`,
          alertId: 'INSTADAPP-15',
          protocol: 'INSTADAPP',
          type: FindingType.Suspicious,
          severity: FindingSeverity.High,
        }),
      ])
    })

    it('should return Failed Removed Event finding', async () => {
      const topicHash: string = generateHash(REMOVED_CONNECTOR)

      const GovEvent = {
        topics: [topicHash],
        address: INSTADAPP_CONNECTOR_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
        status: false,
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: 'INSTADAPP CONNECTOR EVENT',
          description: `Instadapp Failed ${TOPICS.REMOVED} Connector event is detected.`,
          alertId: 'INSTADAPP-15',
          protocol: 'INSTADAPP',
          type: FindingType.Suspicious,
          severity: FindingSeverity.High,
        }),
      ])
    })
  })
})

