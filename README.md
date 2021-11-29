# Instadapp-forta-agents

## Agent List

Connector Contract Event Agent : Track these 3 events : add, remove & update.

Implementation Contract Event Agent : Track these 3 events : add, remove & setDefault.

Governance Event Agent : Track these 3 proposal events : execute, propose, queue.

High INST Movements : Detects Transactions with large INST Transfers (100k)

Token_tracking Agent : High volume of DAI and USDC tokens moving in and out of per DSA ($1M USD, but flexible)

## Test Data

For verifying agent behaviour with transactions - 
 npm run tx <Transaction_Hash>
