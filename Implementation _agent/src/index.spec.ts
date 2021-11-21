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
  INSTADAPP_IMPLEMENTATION_ADDRESS,
  SETDEFAULT_IMPLEMENTATION,
  ADD_IMPLEMENTATION,
  REMOVE_IMPLEMENTATION,
  generateHash,
} from './utils'

describe('Detect Instadapp Implementation Contract Event', () => {
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
        address: INSTADAPP_IMPLEMENTATION_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })
      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([])
    })

    it('should return empty finding - wrong address', async () => {
      const topicHash: string = generateHash(ADD_IMPLEMENTATION)

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
      const topicHash: string = generateHash(ADD_IMPLEMENTATION)

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

  describe('Successed IMPLEMENTATION Transactions', () => {
    it('should return SETDEFAULT Event finding', async () => {
      const topicHash: string = generateHash(SETDEFAULT_IMPLEMENTATION)

      const GovEvent = {
        topics: [topicHash],
        address: INSTADAPP_IMPLEMENTATION_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: 'INSTADAPP IMPLEMENTATION EVENT',
          description: `INSTADAPP SETDEFAULT Implementation Event is detected.`,
          alertId: 'INSTADAPP-14',
          protocol: 'INSTADAPP',
          type: FindingType.Unknown,
          severity: FindingSeverity.Info,
        }),
      ])
    })

    it('should return ADD Event finding', async () => {
      const topicHash: string = generateHash(ADD_IMPLEMENTATION)

      const GovEvent = {
        topics: [topicHash],
        address: INSTADAPP_IMPLEMENTATION_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: 'INSTADAPP IMPLEMENTATION EVENT',
          description: `INSTADAPP ADD Implementation Event is detected.`,
          alertId: 'INSTADAPP-14',
          protocol: 'INSTADAPP',
          type: FindingType.Unknown,
          severity: FindingSeverity.Info,
        }),
      ])
    })

    it('should return REMOVE Event finding', async () => {
      const topicHash: string = generateHash(REMOVE_IMPLEMENTATION)

      const GovEvent = {
        topics: [topicHash],
        address: INSTADAPP_IMPLEMENTATION_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: 'INSTADAPP IMPLEMENTATION EVENT',
          description: `INSTADAPP REMOVE Implementation Event is detected.`,
          alertId: 'INSTADAPP-14',
          protocol: 'INSTADAPP',
          type: FindingType.Unknown,
          severity: FindingSeverity.Info,
        }),
      ])
    })
  })

  describe('Failed Gov Transactions', () => {
    it('should return Failed SETDEFAULT Implementation Event finding', async () => {
      const topicHash: string = generateHash(SETDEFAULT_IMPLEMENTATION)

      const GovEvent = {
        topics: [topicHash],
        address: INSTADAPP_IMPLEMENTATION_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
        status: false,
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: 'INSTADAPP IMPLEMENTATION EVENT',
          description: `INSTADAPP Failed SETDEFAULT Implementation event is detected.`,
          alertId: 'INSTADAPP-13',
          protocol: 'INSTADAPP',
          type: FindingType.Suspicious,
          severity: FindingSeverity.High,
        }),
      ])
    })

    it('should return Failed ADD Implementation Event finding', async () => {
      const topicHash: string = generateHash(ADD_IMPLEMENTATION)

      const GovEvent = {
        topics: [topicHash],
        address: INSTADAPP_IMPLEMENTATION_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
        status: false,
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: 'INSTADAPP IMPLEMENTATION EVENT',
          description: `INSTADAPP Failed ADD Implementation event is detected.`,
          alertId: 'INSTADAPP-13',
          protocol: 'INSTADAPP',
          type: FindingType.Suspicious,
          severity: FindingSeverity.High,
        }),
      ])
    })

    it('should return Failed REMOVE Event finding', async () => {
      const topicHash: string = generateHash(REMOVE_IMPLEMENTATION)

      const GovEvent = {
        topics: [topicHash],
        address: INSTADAPP_IMPLEMENTATION_ADDRESS,
      }
      const txEvent = createTxEvent({
        logs: [GovEvent],
        status: false,
      })

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: 'INSTADAPP IMPLEMENTATION EVENT',
          description: `INSTADAPP Failed REMOVE Implementation event is detected.`,
          alertId: 'INSTADAPP-13',
          protocol: 'INSTADAPP',
          type: FindingType.Suspicious,
          severity: FindingSeverity.High,
        }),
      ])
    })
  })
})

