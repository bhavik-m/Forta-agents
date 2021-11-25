
const BigNumber = require("bignumber.js");
const { ethers } = require("ethers");
const abi = require("./abi.json");
const Web3 = require('web3');
const { Finding, FindingSeverity, FindingType, getEthersProvider } = require("forta-agent");
const {
  tokens,
  TRANSFER_EVENT,
} = require("./constants");


// const web3 = new web3("https://mainnet.infura.io/v3/527044ca4a42499fb15d5be12a4f8f6c");

const ethersProvider = getEthersProvider();

const instaList = new ethers.Contract("0x4c8a1BEb8a87765788946D6B19C6C6355194AbEb", abi, ethersProvider);


const AMOUNT_THRESHOLD = "1";

function provideHandleTransaction(amountThreshold) {
  return async function handleTransaction(txEvent) {
    const findings = [];
    const from = txEvent.from;
    const to = txEvent.to;
    // console.log('from', from);
    const from_account = await instaList.accountID(from)
    const to_account = await instaList.accountID(to)

    const from_account_id = from_account.toNumber();
    const to_account_id = to_account.toNumber();
    // console.log(num)

    if (from_account_id == 0 && to_account_id == 0) {
      return findings;
    }

    for (let token in tokens) {
      const tokenTransferEvents = txEvent.filterLog(
        TRANSFER_EVENT,
        tokens[token].address
      );

      // for (var tokenTransfer of tokenTransferEvents) {

      tokenTransferEvents.forEach((tokenTransfer) => {

        const amount = new BigNumber(
          tokenTransfer.args.value.toString()
        ).dividedBy(10 ** (tokens[token].decimals))

        if (amount.isLessThan(amountThreshold)) return findings;

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
      })

      // }
    }

    return findings;
  };
}

module.exports = {
  provideHandleTransaction,
  handleTransaction: provideHandleTransaction(AMOUNT_THRESHOLD),
};
