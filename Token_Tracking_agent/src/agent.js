const BigNumber = require("bignumber.js");
const { Finding, FindingSeverity, FindingType } = require("forta-agent");
const {
  tokens,
  TRANSFER_EVENT,
} = require("./constants");

const AMOUNT_THRESHOLD = "1";

function provideHandleTransaction(amountThreshold) {
  return async function handleTransaction(txEvent) {
    const findings = [];

    // filter the transaction logs for INST Transfer events
    for (let token in tokens) {

      const tokenTransferEvents = txEvent.filterLog(
        TRANSFER_EVENT,
        tokens[token].address
      );

      // fire alerts for transfers of large amounts
      tokenTransferEvents.forEach((tokenTransfer) => {
        // shift decimal places of transfer amount

        const amount = new BigNumber(
          tokenTransfer.args.value.toString()
        ).dividedBy(10 ** (tokens[token].decimals))



        if (amount.isLessThan(amountThreshold)) return;

        const formattedAmount = amount.toFixed(2);
        findings.push(
          Finding.fromObject({
            name: `Large ${tokens[token].name} Transfer`,
            description: `${formattedAmount} ${tokens[token].name} Transferred`,
            alertId: "INST-41",
            severity: FindingSeverity.Info,
            type: FindingType.Info,
            metadata: {
              from: tokenTransfer.args.from,
              to: tokenTransfer.args.to,
              amount: formattedAmount,
            },
          })
        );
      });
    }

    return findings;
  };
}

module.exports = {
  provideHandleTransaction,
  handleTransaction: provideHandleTransaction(AMOUNT_THRESHOLD),
};
