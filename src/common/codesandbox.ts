export enum RoutePath {
  Home = '/',

  Web3jsExt_Account_Legacy = '/web3js-ext/account/legacy',
  Web3jsExt_Account_Public = '/web3js-ext/account/public',
  Web3jsExt_Account_Role = '/web3js-ext/account/role',
  Web3jsExt_Account_MultiSig = '/web3js-ext/account/multisig',

  Web3jsExt_SignTx_Legacy = '/web3js-ext/tx/legacy',

  Web3jsExt_SignMsg_Legacy = '/web3js-ext/sign/legacy',
  Web3jsExt_SignMsg_MultiSig = '/web3js-ext/sign/multisig',

  EthersExt_Legacy = '/ethers-ext/legacy',
}

export const getPath = ({
  module,
  route,
}: {
  module: `/${string}`
  route: RoutePath
}): string => {
  return `https://codesandbox.io/embed/47sz67?module=${encodeURIComponent(
    module
  )}&initialpath=${encodeURIComponent(route)}`
}
