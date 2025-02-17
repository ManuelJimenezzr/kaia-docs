import { Sandpack } from '@codesandbox/sandpack-react'
import file from './file'

const LegacySand = () => {
  return (
    <Sandpack
      template="react-ts"
      customSetup={{
        dependencies: {
          ethers: '^6.13.5',
          '@kaiachain/ethers-ext': '1.1.0',
        },
      }}
      files={file.code}
    />
  )
}
export default LegacySand
