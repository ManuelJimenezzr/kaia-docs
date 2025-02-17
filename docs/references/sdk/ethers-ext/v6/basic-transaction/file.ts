export default {
  "code": {
    "App.tsx": `import { ethers } from 'ethers'
import { Wallet } from '@kaiachain/ethers-ext/v6'

export default function App() {
const recieverAddr = '0xa3ced31b93d0dfcbf6bd84432fb2459df1941c3a'
const senderAddr = '0xa3ced31b93d0dfcbf6bd84432fb2459df1941c3a'
const senderPriv =
'0x04b85c7d9256e9d2853ec9332031e7d19282a4803387602d2d3729825fc2d463'

const provider = new ethers.JsonRpcProvider(
'https://public-en-kairos.node.kaia.io'
)
const wallet = new Wallet(senderPriv, provider)
async function sendTx() {
  const tx = {
    // when type is empty it will be automatically set to type 0 or 2
    // depending on the gasPrice, maxFeePerGas, maxPriorityFeePerGas fields.
    // here, type will be 2 because no gas-related fields are set.
    from: senderAddr,
    to: recieverAddr,
    value: 1,
  }

  const sentTx = await wallet.sendTransaction(tx)
  console.log('sentTx', sentTx.hash)

  const receipt = await sentTx.wait()
  console.log('receipt', receipt)
}
  return (
    <button onClick={sendTx}>
      Send Transaction
    </button>
  )
}
`,
  }
}
