
const BigNumber = require("bignumber.js");
const { ethers } = require("ethers");
const abi = require("./abi.json");
const { Finding, FindingSeverity, FindingType } = require("forta-agent");
const {
  tokens,
  TRANSFER_EVENT,

} = require("./constants");

const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/527044ca4a42499fb15d5be12a4f8f6c");

const signer = provider.getSigner();
const IIndex = new ethers.Contract("0x4c8a1BEb8a87765788946D6B19C6C6355194AbEb", abi, signer)
// console.log(IIndex);

const AMOUNT_THRESHOLD = "1";
function provideHandleTransaction(amountThreshold) {
  return async function handleTransaction(txEvent) {
    const findings = [];

    console.log(IIndex.accountID("0x65172Eb37b6b4D104c793248FBBb1B4810da4f20"))


    for (let token in tokens) {
      const tokenTransferEvents = txEvent.filterLog(
        TRANSFER_EVENT,
        tokens[token].address
      );

      // fire alerts for transfers of large amounts
      tokenTransferEvents.forEach((tokenTransfer) => {

        const from = tokenTransfer.args.from;
        const to = tokenTransfer.args.to;
        console.log(IIndex.accountID(from).call())
        // if (IIndex.accountID(from) == 0) {
        //   console.log("heff");
        //   return findings;
        // }

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
