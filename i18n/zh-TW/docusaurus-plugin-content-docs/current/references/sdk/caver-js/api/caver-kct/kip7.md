# caver.kct.kip7

caver.kct.kip7 "可幫助您在 kaia 區塊鏈上輕鬆處理以 JavaScript 對象形式實現 KIP-7 的智能合約。

caver.kct.kip7 "繼承了[caver.contract](../caver.contract.md)，以實現 KIP-7 代幣合約。 caver.kct.kip7 "擁有與 "caver.contract "相同的屬性，但還有其他方法來實現額外的功能。 本節僅介紹 "caver.kct.kip7 "新增的綁定方法。

caver.kct.kip7 中使用的 abi 和字節碼是通過 [openzeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC20) 示例實現的。

為 caver-js 實現 KIP-7 的代碼可在 [Kaia Contracts Github Repo](https://github.com/kaiachain/kaia-contracts/tree/main/contracts/KIP/token/KIP7) 上獲取。

有關 KIP-7 的更多信息，請參閱 [Kaia 改進提案](https://kips.kaia.io/KIPs/kip-7)。

## caver.kct.kip7.deploy<a id="caver-klay-kip7-deploy"></a>

```javascript
caver.kct.kip7.deploy(tokenInfo, deployer)
```

將 KIP-7 代幣合約部署到 kaia 區塊鏈上。 使用 caver.kct.kip7.deploy 部署的合約是一種遵循 KIP-7 標準的不可篡改令牌。

成功部署後，將使用新的 KIP17 實例解決承諾問題。

**參數**

| 名稱        | 類型                 | 描述                                                                                                                                                                                                                     |
| --------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tokenInfo | object             | 在 kaia 區塊鏈上部署 KIP-7 代幣合約所需的信息。 詳見下表。                                                                                                                                                                                   |
| deployer  | string \\| object | 密鑰環實例中部署 KIP-7 代幣合約的地址。 該地址必須有足夠的 KAIA 才能部署。 如果要定義發送事務時使用的字段，可以將對象類型作為參數傳遞。 如果要在部署 KIP-17 合約時使用費用委託，可以在對象中定義與費用委託相關的字段。 關於可在對象中定義的字段，請參閱 [創建]（#kip37-create）的參數說明。 |

tokenInfo 對象必須包含以下內容：

| 名稱            | 類型                             | 描述         |
| ------------- | ------------------------------ | ---------- |
| name          | string                         | 代幣名稱       |
| symbol        | string                         | 代幣符號       |
| decimals      | number                         | 標記使用的小數位數。 |
| initialSupply | Buffer \\| string \\| number | 最初提供的代幣總量。 |

**注意** `index`參數接受`number`類型，但如果輸入值超出了number.MAX_SAFE_INTEGER的範圍，可能會導致意外結果或錯誤。 在這種情況下，建議使用 `BigNumber` 類型，特別是對於 `uint256` 大小的數值輸入值。

**返回價值**

PromiEvent\`：一個承諾組合事件發射器，用一個新的 KIP17 實例來解決。 此外，還可能發生以下事件：

| 名稱              | 類型     | 描述                                                                                                        |
| --------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| transactionHash | string | 在事務發送且事務哈希值可用後立即觸發。                                                                                       |
| receipt         | object | 當交易收據可用時觸發。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt]。 來自 KIP17 實例的收據有一個通過 abi 解析的 "事件 "屬性，而不是 "日誌 "屬性。 |
| error           | Error  | 發送過程中發生錯誤時觸發。                                                                                             |

**示例**

```javascript
// using the promise
> caver.kct.kip7.deploy({
    name: 'Jasmine',
    symbol: 'JAS',
    decimals: 18,
    initialSupply: '100000000000000000000',
}, '0x{address in hex}').then(console.log)
KIP7 {
    ...
    _address: '0x598367e443D8a2b644Fec69a2C12aF44BC283f23',
    _jsonInterface: [
        ...
        {
            anonymous: false,
            inputs: [
                { indexed: true, name: 'owner', type: 'address' },
                    { indexed: true, name: 'spender', type: 'address' },
                    { indexed: false, name: 'value', type: 'uint256' }
            ],
            name: 'Approval',
            type: 'event',
            signature:  '0x8c5be...'
        }
    ] 
}

// Send object as second parameter
> caver.kct.kip7.deploy({
        name: 'Jasmine',
        symbol: 'JAS',
        decimals: 18,
        initialSupply: '100000000000000000000',
    },
    {
        from: '0x{address in hex}',
        feeDelegation: true,
        feePayer: '0x{address in hex}',
    }).then(console.log)

// using event emitter and promise
> caver.kct.kip7.deploy({
    name: 'Jasmine',
    symbol: 'JAS',
    decimals: 18,
    initialSupply: '100000',
}, '0x{address in hex}')
.on('error', function(error) { ... })
.on('transactionHash', function(transactionHash) { ... })
.on('receipt', function(receipt) {
    console.log(receipt.contractAddress) // contains the new token contract address
})
.then(function(newKIP7Instance) {
    console.log(newKIP7Instance.options.address) // instance with the new token contract address
})
```

## caver.kct.kip7.detectInterface<a id="caver-kct-kip7-detectinterface"></a>

```javascript
caver.kct.kip7.detectInterface(contractAddress
```

返回代幣合約實現的接口信息。 此靜態函數將使用 [kip17.detectInterface](#kip17-detectinterface)。

**參數**

| 名稱              | 類型     | 描述            |
| --------------- | ------ | ------------- |
| contractAddress | string | KIP-7 代幣合約的地址 |

**返回價值**

Promise "會返回一個 "對象"，其中包含每個[KIP-7 接口](https://kips.kaia.io/KIPs/kip-7#kip-13-identifiers)是否已實現的布爾值結果。

**示例**

```javascript
> caver.kct.kip7.detectInterface('0x{address in hex}').then(console.log)
{
    IKIP7: true,
    IKIP7Metadata: true,
    IKIP7Mintable: true,
    IKIP7Burnable: true,
    IKIP7Pausable: true,
}
```

## caver.kct.kip7.create<a id="caver-kct-kip7-create"></a>

```javascript
caver.kct.kip7.create([tokenAddress
```

創建新的 KIP17 實例及其綁定的方法和事件。 該功能與 [new KIP17]（#new-kip17）相同。

**注意** `caver.kct.kip7.create`從 caver-js [v1.6.1](https://www.npmjs.com/package/caver-js/v/1.6.1) 開始支持。

**參數**

請參見 [new KIP17]（#new-kip17）。

**返回價值**

請參見 [new KIP17]（#new-kip17）。

**示例**

```javascript
// Create a KIP7 instance without a parameter
> const kip7 = caver.kct.kip7.create()

// Create a KIP7 instance with a token address
> const kip7 = caver.kct.kip7.create('0x{address in hex}')
```

## 新 KIP17<a id="new-kip17"></a>

```javascript
new caver.kct.kip7([tokenAddress])
```

創建新的 KIP17 實例及其綁定的方法和事件。

**參數**

| 名稱           | 類型     | 描述                                                                                   |
| ------------ | ------ | ------------------------------------------------------------------------------------ |
| tokenAddress | string | (可選）KIP-7 代幣合約的地址，可稍後通過 `kip17.options.address = '0x1234...'` 指定。 |

**返回價值**

| 類型     | 描述                  |
| ------ | ------------------- |
| object | KIP17 實例及其綁定的方法和事件。 |

**示例**

```javascript
// Create a KIP7 instance without a parameter
> const kip7 = new caver.kct.kip7()

// Create a KIP7 instance with a token address
> const kip7 = new caver.kct.kip7('0x{address in hex}')
```

## kip17.clone<a id="kip17-clone"></a>

```javascript
kip17.clone([tokenAddress])
```

克隆當前 KIP17 實例。

**參數**

| 名稱           | 類型     | 描述                                                                   |
| ------------ | ------ | -------------------------------------------------------------------- |
| tokenAddress | string | (可選）部署另一個 KIP-17 代幣的智能合約地址。 如果省略，則將設置為原始實例中的合約地址。 |

**返回價值**

| 類型     | 描述              |
| ------ | --------------- |
| object | 原始 KIP17 實例的克隆。 |

**示例**

```javascript
> const kip7 = new caver.kct.kip7(address)

// Clone without a parameter
> const cloned = kip7.clone()

// Clone with the address of the new token contract
> const cloned = kip7.clone('0x{address in hex}')
```

## kip17.detectInterface<a id="kip17-detectinterface"></a>

```javascript
kip17.detectInterface()
```

返回代幣合約實現的接口信息。

**參數**

無

**返回價值**

Promise "會返回一個 "對象"，其中包含每個[KIP-7 接口](https://kips.kaia.io/KIPs/kip-7#kip-13-identifiers)是否已實現的布爾值結果。

**示例**

```javascript
> kip37.detectInterface().then(console.log)
{
    IKIP37: true,
    IKIP37Metadata: true,
    IKIP37Mintable: true,
    IKIP37Burnable: true,
    IKIP37Pausable: true,
}
```

## kip7.supportsInterface <a id="kip7-supportsinterface"></a>

```javascript
kip17.supportsInterface(interfaceId)
```

如果此合約實現了由 `interfaceId` 定義的接口，則返回 `true`。

**參數**

| 名稱          | 類型     | 描述                |
| ----------- | ------ | ----------------- |
| interfaceId | string | 要檢查的 interfaceId。 |

**返回價值**

`Promise` 返回 `boolean`：如果此合約實現了由 "`interfaceId` 定義的接口，則返回 "true"。

**示例**

```javascript
> kip7.supportsInterface('0x65787371').then(console.log)
true

> kip7.supportsInterface('0x3a2820fe').then(console.log)
false
```

## kip17.name<a id="kip17-name"></a>

```javascript
kip17.name()
```

返回代幣的名稱。

**參數**

無

**返回價值**

`Promise` 返回 `string`：代幣的名稱。

**示例**

```javascript
> kip17.name().then(console.log)
Jasmine
```

## kip7.symbol<a id="kip7-symbol"></a>

```javascript
kip7.symbol()
```

返回代幣的符號。

**參數**

無

**返回價值**

`Promise` 返回 `string`：標記的符號。

**示例**

```javascript
> kip7.symbol().then(console.log)
JAS
```

## kip7.decimals<a id="kip7-decimals"></a>

```javascript
kip7.decimals()
```

返回標記使用的小數位數。

**參數**

無

**返回價值**

`Promise` 返回 `number`：代幣使用的小數位數。

**示例**

```javascript
> kip7.decimals().then(console.log)
18
```

## kip7.totalSupply<a id="kip7-totalsupply"></a>

```javascript
kip7.totalSupply()
```

返回全部代幣供應。

**參數**

無

**返回價值**

`Promise` 返回 `BigNumber`：代幣總數。

**示例**

```javascript
> kip7.totalSupply().then(console.log)
1000000000000000000000000
```

## kip7.balanceOf<a id="kip7-balanceof"></a>

```javascript
kip17.balanceOf(address)
```

返回給定賬戶地址的餘額。

**參數**

| 名稱      | 類型     | 描述          |
| ------- | ------ | ----------- |
| address | string | 要查詢餘額的賬戶地址。 |

**返回價值**

`Promise` 返回 `BigNumber`：賬戶餘額。

**示例**

```javascript
> kip7.balanceOf('0x{address in hex}').then(console.log)
100000
```

## kip7.allowance<a id="kip7-allowance"></a>

```javascript
kip7.allowance(owner, spender)
```

返回允許 `spender` 從 `owner` 提取的代幣數量。

**參數**

| 名稱      | 類型     | 描述              |
| ------- | ------ | --------------- |
| owner   | string | 代幣所有者賬戶的地址。     |
| spender | string | 代替所有者使用代幣的賬戶地址。 |

**返回價值**

承諾 "返回 "大數"：允許花費者代替所有者花費的剩餘代幣數量。

**示例**

```javascript
> kip7.allowance('0x{address in hex}', '0x{address in hex}').then(console.log)
0

> kip7.allowance('0x{address in hex}', '0x{address in hex}').then(console.log)
10
```

## kip7.isMinter<a id="kip7-isminter"></a>

```javascript
kip7.isMinter(address)
```

如果給定賬戶是可以發行新 KIP7 代幣的礦工，則返回 `true`。

**參數**

| 名稱      | 類型     | 描述              |
| ------- | ------ | --------------- |
| address | string | 檢查是否擁有鑄幣權的賬戶地址。 |

**返回價值**

`Promise`  返回 \`boolean：如果賬戶是礦工，則返回 "true"。

**示例**

```javascript
> kip7.isMinter('0x{address in hex}').then(console.log)
true

> kip7.isMinter('0x{address in hex}').then(console.log)
false
```

## kip7.isPauser<a id="kip7-ispauser"></a>

```javascript
kip7.isPauser(address)
```

如果給定賬戶是可以暫停轉讓代幣的暫停者，則返回 `true`。

**參數**

| 名稱      | 類型     | 描述                         |
| ------- | ------ | -------------------------- |
| address | string | 要檢查的賬戶地址，以確定該賬戶是否有權暫停代幣轉賬。 |

**返回價值**

`Promise` 返回 \`boolean：如果賬戶是 pauser，則返回 "true"。

**示例**

```javascript
> kip7.isPauser('0x{address in hex}').then(console.log)
true

> kip7.isPauser('0x{address in hex}').then(console.log)
false
```

## kip7.paused<a id="kip7-paused"></a>

```javascript
kip7.paused()
```

如果合約暫停，則返回 `true`，否則返回 `false`。

**參數**

無

**返回價值**

`Promise` 返回 `boolean`：如果合約暫停，則返回 `true`。

**示例**

```javascript
> kip7.paused().then(console.log)
true

> kip7.paused().then(console.log)
false
```

## kip7.approve<a id="kip7-approve"></a>

```javascript
kip7.approve(spender, amount [, sendParam])
```

設置 "支出者 "要支出的代幣所有者代幣的 "金額"。

請注意，此方法將向 kaia 網絡提交所有者的交易，而 kaia 網絡將向所有者收取交易費。

**參數**

| 名稱        | 類型                             | 描述                                    |
| --------- | ------------------------------ | ------------------------------------- |
| spender   | string                         | 代替所有者使用代幣的賬戶地址。                       |
| 數量        | Buffer \\| string \\| number | 允許支出人使用的代幣id。                         |
| sendParam | object                         | (可選）保存發送事務所需參數的對象。 |

**注意**\* `amount`參數接受 `number`類型，但如果輸入值超出 number.MAX_SAFE_INTEGER 的範圍，可能會導致意外結果或錯誤。 在這種情況下，建議使用 `BigNumber` 類型，特別是對於 `uint256` 大小的數值輸入值。

`sendParam` 對象包含以下內容：

| 名稱            | 類型                                        | 描述                                                                                                                                                                                                      |
| ------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from          | string                                    | (可選） 發送交易的地址。 如果省略，將由 `kip17.options.from` 設置。 如果未提供 `sendParam` 對象中的 `from` 或 `kip17.options.from`，則會發生錯誤。                                                                          |
| gas           | number \\| string                        | (可選）本次交易提供的最大 gas（gas 限值）。 如果省略，將由 caver-js 通過調用`kip17.methods.approve(spender, tokenId).estimateGas({from})`來設置。                                                                    |
| gasPrice      | number \\| string                        | (可選）本次交易使用的 Gas 價格（以 peb 為單位）。 如果省略，將由 caver-js 通過調用 `caver.klay.getGasPrice`來設置。                                                                                                    |
| value         | number \\| string \\| BN \\| BigNumber | (可選）以 peb 為單位傳輸的值。                                                                                                                                                                   |
| feeDelegation | boolean                                   | (可選，默認為 `false`）是否使用費用委託交易。 如果省略，將使用 \`kip17.options.feeDelegation'。 如果兩者都省略，則不使用收費授權。                                                               |
| feePayer      | string                                    | (可選）支付交易費的繳費人地址。 當 "feeDelegation "為 "true "時，該值將設置為交易中的 "feePayer "字段。 如果省略，將使用 \`kip17.options.feePayer'。 如果兩者都省略，則會出錯。                            |
| feeRatio      | string                                    | (可選）繳費人將承擔的交易費比例。 如果 "feeDelegation "為 "true"，且 "feeRatio "設置為有效值，則使用部分費用委託交易。 有效範圍為 1 到 99。 不允許比率為 0 或 100 及以上。 如果省略，將使用 \`kip17.options.feeRatio'。 |

**注意** `feeDelegation`、`feePayer` 和 `feeRatio`從 caver-js [v1.6.1](https://www.npmjs.com/package/caver-js/v/1.6.1) 開始支持。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP37 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given 
> kip7.approve('0x{address in hex}', 10, { from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0xf010a98f66b6b36943175cd5b249da54e84abed551cfa02846a2900ddab968c7',
    blocknumber: 2098,
    contractAddress: null,
    from: '0x2f7dc98bd93a0544b03d6ff428a6f4ae04b32676',
    ...
    status: true,
    to: '0x8ca777e464a83b939ae131ca037f0d8728c6929e',
    ...
    events: {
        Approval: {
            address: '0x8CA777e464a83b939AE131CA037F0d8728C6929e',
            blocknumber: 2098,
            transactionHash: '0xf7469c0420cb5ebb0fbf64a314bd0c9ee7517ea64dd72eefa59bc8005bbc0f99',
            transactionIndex: 0,
            blockHash: '0xf010a98f66b6b36943175cd5b249da54e84abed551cfa02846a2900ddab968c7',
            logIndex: 0,
            id: 'log_c6ec61aa',
            returnValues: {
                '0': '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                '1': '0xe36ffD7bc4D588c480B5925B9622881F9d85ea30',
                '2': '10',
                owner: '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                spender: '0xe36ffD7bc4D588c480B5925B9622881F9d85ea30',
                value: '10'
            },
            event: 'Approval',
            signature: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
            raw: {
                data: '0x000000000000000000000000000000000000000000000000000000000000000a',
                topics: [ '0x8c5be...', '0x00...676', '0x00...a30' ]
            },
        },
    },
}

// Using FD transaction to execute the smart contract
> kip7.approve('0x{address in hex}', 10, {
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.approve('0x{address in hex}', 10).then(console.log)
```

## kip7.transfer<a id="kip7-transfer"></a>

```javascript
kip7.transfer(recipient, amount [, sendParam])
```

將給定 "金額 "的代幣從代幣所有者的餘額轉給 "接收者"。 代幣所有者應親自執行令牌轉讓。 因此，授權地址或令牌所有者應是該交易的發送方，其地址必須在 `sendParam.from` 或 `kip17Instance.options.from` 中給出。 如果不提供 `sendParam.from` 或 `kip17.options.from`，就會發生錯誤。

請注意，發送此交易將向交易發送方收取交易費。

**參數**

| 名稱        | 類型                                | 描述                                                                                                |
| --------- | --------------------------------- | ------------------------------------------------------------------------------------------------- |
| recipient | string                            | 接收代幣的賬戶地址。                                                                                        |
| amounts   | BigNumber \\| string \\| number | 要銷燬的代幣數量。                                                                                         |
| sendParam | object                            | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意** `index`參數接受`number`類型，但如果輸入值超出了number.MAX_SAFE_INTEGER的範圍，可能會導致意外結果或錯誤。 在這種情況下，建議使用 `BigNumber` 類型，特別是對於 `uint256` 大小的數值輸入值。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP37 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given 
> kip7.approve('0x{address in hex}', 10, { from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0xf010a98f66b6b36943175cd5b249da54e84abed551cfa02846a2900ddab968c7',
    blocknumber: 2098,
    contractAddress: null,
    from: '0x2f7dc98bd93a0544b03d6ff428a6f4ae04b32676',
    ...
    status: true,
    to: '0x8ca777e464a83b939ae131ca037f0d8728c6929e',
    ...
    events: {
        Approval: {
            address: '0x8CA777e464a83b939AE131CA037F0d8728C6929e',
            blocknumber: 2098,
            transactionHash: '0xf7469c0420cb5ebb0fbf64a314bd0c9ee7517ea64dd72eefa59bc8005bbc0f99',
            transactionIndex: 0,
            blockHash: '0xf010a98f66b6b36943175cd5b249da54e84abed551cfa02846a2900ddab968c7',
            logIndex: 0,
            id: 'log_c6ec61aa',
            returnValues: {
                '0': '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                '1': '0xe36ffD7bc4D588c480B5925B9622881F9d85ea30',
                '2': '10',
                owner: '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                spender: '0xe36ffD7bc4D588c480B5925B9622881F9d85ea30',
                value: '10'
            },
            event: 'Approval',
            signature: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
            raw: {
                data: '0x000000000000000000000000000000000000000000000000000000000000000a',
                topics: [ '0x8c5be...', '0x00...676', '0x00...a30' ]
            },
        },
    },
}

// Using FD transaction to execute the smart contract
> kip7.approve('0x{address in hex}', 10, {
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.approve('0x{address in hex}', 10).then(console.log)
```

## kip7.safeTransfer<a id="kip7-safetransfer"></a>

```javascript
kip7.safeTransfer(recipient, amount [, data] [, sendParam])
```

從代幣所有者的餘額中安全地將給定的代幣 "金額 "轉給 "接收者"。 代幣所有者應親自執行代幣轉讓。 因此，授權地址或令牌所有者應是該交易的發送方，其地址必須在 `sendParam.from` 或 `kip17Instance.options.from` 中給出。 如果不提供 `sendParam.from` 或 `kip17.options.from`，就會發生錯誤。

如果 `to` 是合約地址，則必須執行 [IKIP17Receiver.onKIP17Received](https://kips.kaia.io/KIPs/kip-7#wallet-interface). 否則，轉賬將被撤銷。

請注意，發送此交易將向交易發送方收取交易費。

**參數**

| 名稱        | 類型                                | 描述                                                                                                |
| --------- | --------------------------------- | ------------------------------------------------------------------------------------------------- |
| recipient | string                            | 接收代幣的賬戶地址。                                                                                        |
| amounts   | BigNumber \\| string \\| number | 您要轉移的代幣的 ID。                                                                                      |
| data      | Buffer \\| string \\| number    | (可選）與呼叫一起發送的可選數據。                                                              |
| sendParam | object                            | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意**\* "金額 "參數接受 "數字 "類型，但如果輸入值超出 number.MAX_SAFE_INTEGER 的範圍，可能會導致意外結果或錯誤。 在這種情況下，建議使用 `BigNumber` 類型，特別是對於 `uint256` 大小的數值輸入值。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP37 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given (without data)
> kip7.safeTransfer('0x{address in hex}', 10, { from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0x208cd64b95bbd91420fc6b1a7b514a8d3051d09333d79244b6b74ff2f7f3eee4',
    blocknumber: 2384,
    contractAddress: null,
    from: '0xc2c84328845a36fe0c4dcef370d24ec80cf85221',
    ...
    status: true,
    to: '0xe4aeba6306b0df023aa4b765960fa59dbe925950',
    ...
    events: {
            Transfer: {
                    address: '0xe4AeBa6306b0Df023AA4b765960fA59dbE925950',
                    blocknumber: 2384,
                    transactionHash: '0x47bb085947c282722c1ceab1f4f0380d911ce464a47a19f1e7bddfe08a13563d',
                    transactionIndex: 0,
                    blockHash: '0x208cd64b95bbd91420fc6b1a7b514a8d3051d09333d79244b6b74ff2f7f3eee4',
                    logIndex: 0,
                    id: 'log_58e5e06d',
                    returnValues: {
                            '0': '0xC2C84328845A36Fe0c4DcEf370d24ec80cF85221',
                            '1': '0x67B092d09B5e94fed58609777cc7Ac9193553B73',
                            '2': '10',
                            from: '0xC2C84328845A36Fe0c4DcEf370d24ec80cF85221',
                            to: '0x67B092d09B5e94fed58609777cc7Ac9193553B73',
                            value: '10',
                    },
                    event: 'Transfer',
                    signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    raw: {
                            data: '0x000000000000000000000000000000000000000000000000000000000000000a',
                            topics: [ '0xddf25...', '0x00...221', '0x00...b73' ],
                    },
            },
    },
}

// Using FD transaction to execute the smart contract
> kip7.safeTransfer('0x{address in hex}', 10, {
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Send via a sendParam object with the from field given (with data)
> kip7.safeTransfer('0x{address in hex}', 11, '0x1234', { from: '0x{address in hex}' }).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.safeTransfer('0x{address in hex}', 11).then(console.log)
```

## kip7.transferFrom<a id="kip7-transferfrom"></a>

```javascript
kip7.transferFrom(sender, recipient, amount [, sendParam])
```

將給定 "金額 "的代幣從代幣所有者的餘額轉給 "接收者"。 獲准發送代幣所有者代幣的地址將執行該代幣轉移交易。 因此，獲得批准的應該是該事務的發件人，其地址必須在`sendParam.from`或`kip7.options.from`中給出。 如果不提供 `sendParam.from` 或 `kip7.options.from`，就會發生錯誤。

請注意，發送此交易將向交易發送方收取交易費。

**參數**

| 名稱        | 類型                                | 描述                                                                                                |
| --------- | --------------------------------- | ------------------------------------------------------------------------------------------------- |
| sender    | string                            | 擁有要與津貼機制一起發送的代幣的賬戶地址。                                                                             |
| recipient | string                            | 接收代幣的賬戶地址。                                                                                        |
| amount    | BigNumber \\| string \\| number | 您要轉移的代幣數量。                                                                                        |
| sendParam | object                            | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意**\* "金額 "參數接受 "數字 "類型，但如果輸入值超出 number.MAX_SAFE_INTEGER 的範圍，可能會導致意外結果或錯誤。 在這種情況下，建議使用 `BigNumber` 類型，特別是對於 `uint256` 大小的數值輸入值。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP7 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given
> kip7.transferFrom('0x{address in hex}', '0x{address in hex}', 10000, { from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0x3adec238e06a9e8d5fa09fc1e1d7c8748b64d07e89678d27e8a379a12a34974f',
    blocknumber: 2331,
    contractAddress: null,
    from: '0x01958c62ab4aec7fc282bec9491da0ef7f830ac2',
    ...
    status: true,
    to: '0x3d5eb40665d25aaa4160023c4278fa6a94ba4acb',
    ...
    events: {
        Transfer: {
            address: '0x3D5EB40665D25aAa4160023C4278FA6A94BA4aCb',
            blocknumber: 2331,
            transactionHash: '0x5b2232b68681f19d9b6fcd6fb03964ef105912fecb772c11c8ec9fc906be4cbf',
            transactionIndex: 0,
            blockHash: '0x3adec238e06a9e8d5fa09fc1e1d7c8748b64d07e89678d27e8a379a12a34974f',
            logIndex: 0,
            id: 'log_ae57b7a0',
            returnValues: {
                '0': '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                '1': '0x49ff9cb8BB8CA10D7f6E1094b2Ba56c3C2DBA231',
                '2': '10000',
                from: '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                to: '0x49ff9cb8BB8CA10D7f6E1094b2Ba56c3C2DBA231',
                value: '10000'
            },
            event: 'Transfer',
            signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            raw: {
                data: '0x0000000000000000000000000000000000000000000000000000000000002710',
                topics: [ '0xddf25...', '0x00...676', '0x00...231' ]
            },
        },
        Approval: {
            address: '0x3D5EB40665D25aAa4160023C4278FA6A94BA4aCb',
            blocknumber: 2331,
            transactionHash: '0x5b2232b68681f19d9b6fcd6fb03964ef105912fecb772c11c8ec9fc906be4cbf',
            transactionIndex: 0,
            blockHash: '0x3adec238e06a9e8d5fa09fc1e1d7c8748b64d07e89678d27e8a379a12a34974f',
            logIndex: 1,
            id: 'log_cee37d26',
            returnValues: {
                '0': '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                '1': '0x01958c62aB4aEC7fC282bEc9491dA0EF7F830AC2',
                '2': '0',
                owner: '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                spender: '0x01958c62aB4aEC7fC282bEc9491dA0EF7F830AC2',
                value: '0'
            },
            event: 'Approval',
            signature: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
            raw: {
                data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                topics: [ '0x8c5be...', '0x00...676', '0x00...ac2' ]
            },
        },
    },
}

// Using FD transaction to execute the smart contract
> kip7.transferFrom('0x{address in hex}', '0x{address in hex}', 10000, {
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.transferFrom('0x{address in hex}', '0x{address in hex}', 10000).then(console.log)
```

## kip7.safeTransferFrom<a id="kip7-safetransferfrom"></a>

```javascript
kip7.safeTransferFrom(sender, recipient, amount [, data] [, sendParam])
```

從代幣所有者的餘額中安全地將給定的代幣 "金額 "轉給 "接收者"。 獲准發送代幣所有者代幣的地址將執行該代幣轉移交易。 因此，獲得批准的應該是該事務的發件人，其地址必須在`sendParam.from`或`kip7.options.from`中給出。 如果不提供 `sendParam.from` 或 `kip7.options.from`，就會發生錯誤。

如果收件人是合同地址，則應執行 [IKIP7Receiver.onKIP7Received](https://kips.kaia.io/KIPs/kip-7#wallet-interface)。 否則，將恢復轉賬。

請注意，發送此交易將向交易發送方收取交易費。

**參數**

| Name      | Type                              | Description                                                                                       |
| --------- | --------------------------------- | ------------------------------------------------------------------------------------------------- |
| sender    | string                            | 擁有要與津貼機制一起發送的代幣的賬戶地址。                                                                             |
| recipient | string                            | 接收代幣的賬戶地址。                                                                                        |
| amount    | BigNumber \\| string \\| number | 您要轉移的代幣數量。                                                                                        |
| data      | Buffer \\| string \\| number    | (可選）與呼叫一起發送的可選數據。                                                              |
| sendParam | object                            | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意**\* "金額 "參數接受 "數字 "類型，但如果輸入值超出 number.MAX_SAFE_INTEGER 的範圍，可能會導致意外結果或錯誤。 在這種情況下，建議使用 `BigNumber` 類型，特別是對於 `uint256` 大小的數值輸入值。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP17 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given (without data)
> kip7.safeTransferFrom('0x{address in hex}', '0x{address in hex}', 10000, { from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0x0d641b9cebb032f10348288623898f8aa319faa0845c5b3b7a59ac397a6a218b',
    blocknumber: 2404,
    contractAddress: null,
    from: '0x090937f5c9b83d961da29149a3c37104bc5e71b3',
    ...
    status: true,
    to: '0xe4aeba6306b0df023aa4b765960fa59dbe925950',
    ...
    events: {
            Transfer: {
                    address: '0xe4AeBa6306b0Df023AA4b765960fA59dbE925950',
                    blocknumber: 2404,
                    transactionHash: '0xed8c33facaea963f57c268134aaab48fa765e7298fd70d4bc796b1e93c12ad45',
                    transactionIndex: 0,
                    blockHash: '0x0d641b9cebb032f10348288623898f8aa319faa0845c5b3b7a59ac397a6a218b',
                    logIndex: 0,
                    id: 'log_5eaef2c3',
                    returnValues: {
                            '0': '0xC2C84328845A36Fe0c4DcEf370d24ec80cF85221',
                            '1': '0x67B092d09B5e94fed58609777cc7Ac9193553B73',
                            '2': '10000',
                            from: '0xC2C84328845A36Fe0c4DcEf370d24ec80cF85221',
                            to: '0x67B092d09B5e94fed58609777cc7Ac9193553B73',
                            value: '10000',
                    },
                    event: 'Transfer',
                    signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    raw: {
                            data: '0x0000000000000000000000000000000000000000000000000000000000002710',
                            topics: [ '0xddf25...', '0x00...221', '0x00...b73' ],
                    },
            },
            Approval: {
                    address: '0xe4AeBa6306b0Df023AA4b765960fA59dbE925950',
                    blocknumber: 2404,
                    transactionHash: '0xed8c33facaea963f57c268134aaab48fa765e7298fd70d4bc796b1e93c12ad45',
                    transactionIndex: 0,
                    blockHash: '0x0d641b9cebb032f10348288623898f8aa319faa0845c5b3b7a59ac397a6a218b',
                    logIndex: 1,
                    id: 'log_3f3aedf8',
                    returnValues: {
                            '0': '0xC2C84328845A36Fe0c4DcEf370d24ec80cF85221',
                            '1': '0x090937f5C9B83d961da29149a3C37104Bc5e71B3',
                            '2': '0',
                            owner: '0xC2C84328845A36Fe0c4DcEf370d24ec80cF85221',
                            spender: '0x090937f5C9B83d961da29149a3C37104Bc5e71B3',
                            value: '0',
                    },
                    event: 'Approval',
                    signature: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
                    raw: {
                            data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                            topics: [ '0x8c5be...', '0x00...221', '0x00...1b3' ],
                    },
            },
    },
}

// Using FD transaction to execute the smart contract
> kip7.safeTransferFrom('0x{address in hex}', '0x{address in hex}', 10000, {
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Send via a sendParam object with the from field given (with data)
> kip7.safeTransferFrom('0x{address in hex}', '0x{address in hex}', 11, '0x1234', { from: '0x{address in hex}' }).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.safeTransferFrom('0x{address in hex}', '0x{address in hex}', 11).then(console.log)
```

## kip7.mint <a id="kip7-mint"></a>

```javascript
kip7.mint(account, amount [, sendParam])
```

創建 "數量 "代幣並將其發送到 "賬戶"，增加代幣的總供應量。

請注意，此方法將向 kaia 網絡提交交易，而 kaia 網絡將向發送方收取交易費。

**參數**

| Name      | 類型                                | 描述                                                                                                |
| --------- | --------------------------------- | ------------------------------------------------------------------------------------------------- |
| account   | string                            | 將向其發行新幣的賬戶地址。                                                                                     |
| amount    | BigNumber \\| string \\| number | 正在鑄造的代幣數量。                                                                                        |
| sendParam | object                            | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意**\* "金額 "參數接受 "數字 "類型，但如果輸入值超出 number.MAX_SAFE_INTEGER 的範圍，可能會導致意外結果或錯誤。 在這種情況下，建議使用 `BigNumber` 類型，特別是對於 `uint256` 大小的數值輸入值。

**注意**\* 如果給出了 `sendParam.from` 或 `kip7.options.from` ，則應是具有 MinterRole 的礦工。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP7 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given 
> kip7.mint('0x{address in hex}', 10000, { from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0x71e1c7c9de471ed9eb9ec2aca09beb63a654e21514b2b8d25ec93f34b810a709',
    blocknumber: 8466,
    contractAddress: null,
    from: '0x2f7dc98bd93a0544b03d6ff428a6f4ae04b32676',
    ...
    status: true,
    to: '0x54e9ad10ffcbcc2384863157c851a75a31c1e925',
    ...
    events: {
        Transfer: {
            address: '0x54e9Ad10FFcBCc2384863157c851A75a31C1E925',
            blocknumber: 8466,
            transactionHash: '0xef1db1544d0ba70aa06b77599a8421cee2270703cff7d0233bd09ab3561ab49a',
            transactionIndex: 0,
            blockHash: '0x71e1c7c9de471ed9eb9ec2aca09beb63a654e21514b2b8d25ec93f34b810a709',
            logIndex: 0,
            id: 'log_151f8e90',
            returnValues: {
                '0': '0x0000000000000000000000000000000000000000',
                '1': '0x4756D3c2A3DC61450D949BD9bF702b4209Fc15a0',
                '2': '10000',
                from: '0x0000000000000000000000000000000000000000',
                to: '0x4756D3c2A3DC61450D949BD9bF702b4209Fc15a0',
                value: '10000',
            },
            event: 'Transfer',
            signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            raw: {
                data: '0x0000000000000000000000000000000000000000000000000000000000002710',
                topics: [ '0xddf25...', '0x00...000', '0x00...5a0' ],
            },
        },
    },
}

// Using FD transaction to execute the smart contract
> kip7.mint('0x{address in hex}', 10000, {
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.mint('0x{address in hex}', 10000).then(console.log)
```

## kip7.addMinter<a id="kip7-addminter"></a>

```javascript
kip7.addMinter(account [, sendParam])
```

添加一個允許製造代幣的礦工賬戶。

請注意，此方法將向 kaia 網絡提交交易，而 kaia 網絡將向發送方收取交易費。

**參數**

| Name      | 類型     | 描述                                                                                                |
| --------- | ------ | ------------------------------------------------------------------------------------------------- |
| account   | string | 要添加為礦工的賬戶地址。                                                                                      |
| sendParam | object | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意**\* 如果給出了 `sendParam.from` 或 `kip17.options.from` ，則應是礦工。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP7 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given 
> kip7.addMinter('0x{address in hex}', { from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0x169db7e80c954f7d95bbb6a5ef3065190e842d515485e1679f8f3027d1b2975f',
    blocknumber: 9593,
    contractAddress: null,
    from: '0x2f7dc98bd93a0544b03d6ff428a6f4ae04b32676',
    ...
    status: true,
    to: '0x9e2851aff794e69c58e112a3beacbf0de6587f6b',
    ...
    events: {
        MinterAdded: {
            address: '0x9E2851Aff794E69C58E112a3beacbF0De6587f6b',
            blocknumber: 9593,
            transactionHash: '0x11c86fe739ce3f8e6f93f5de87c9626c7cd032dd5e119171f9ec821292cd68e9',
            transactionIndex: 0,
            blockHash: '0x169db7e80c954f7d95bbb6a5ef3065190e842d515485e1679f8f3027d1b2975f',
            logIndex: 0,
            id: 'log_d93efbcd',
            returnValues: {
                '0': '0x823EA6Eb41985218D478C07E77cFBdAd233569C5',
                account: '0x823EA6Eb41985218D478C07E77cFBdAd233569C5',
            },
            event: 'MinterAdded',
            signature: '0x6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f6',
            raw: {
                data: '0x',
                topics: [ '0x6ae17...', '0x00...9c5' ],
            },
        },
    },
}

// Using FD transaction to execute the smart contract
> kip7.addMinter('0x{address in hex}', {
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.addMinter('0x{address in hex}').then(console.log)
```

## kip7.renounceMinter<a id="kip7-renounceminter"></a>

```javascript
kip7.renounceMinter([sendParam])
```

放棄鑄造代幣的權利。 只有鑄幣廠地址可以放棄鑄幣權。

請注意，此方法將向 kaia 網絡提交交易，而 kaia 網絡將向發送方收取交易費。

**參數**

| 名稱        | 類型     | 描述                                                                                                |
| --------- | ------ | ------------------------------------------------------------------------------------------------- |
| sendParam | object | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意**\* 如果給出了 `sendParam.from` 或 `kip7.options.from` ，則應是具有 MinterRole 的礦工。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP37 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given 
> kip7.renounceMinter({ from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0xc1d96a519d9a31a1dab77111af0de73241aa212722859062a96dc3115a2eca23',
    blocknumber: 9996,
    contractAddress: null,
    from: '0x34b91db0f4c7d1381fdf054cc3d0c433b19fca16',
    ...
    status: true,
    to: '0xeba808dcd0fdbfc21a99961be42665f351487f52',
    ...
    events: {
        MinterRemoved: {
            address: '0xebA808dCD0Fdbfc21a99961BE42665f351487F52',
            blocknumber: 9996,
            transactionHash: '0x52328e3cfb8061915d000dc308ffd67650fa36cf4560f1fb12fdb28a7c903ac9',
            transactionIndex: 0,
            blockHash: '0xc1d96a519d9a31a1dab77111af0de73241aa212722859062a96dc3115a2eca23',
            logIndex: 0,
            id: 'log_bd3a8e46',
            returnValues: {
                '0': '0x34b91Db0F4c7D1381FdF054cc3D0c433B19fCa16',
                account: '0x34b91Db0F4c7D1381FdF054cc3D0c433B19fCa16',
            },
            event: 'MinterRemoved',
            signature: '0xe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb66692',
            raw: {
                data: '0x',
                topics: [ '0xe9447...', '0x00...a16' ],
            },
        },
    },
}

// Using FD transaction to execute the smart contract
> kip7.renounceMinter({
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.renounceMinter().then(console.log)
```

## kip7.burn<a id="kip7-burn"></a>

```javascript
kip7.burn(amount [, sendParam])
```

銷燬發送方餘額中的代幣 "數量"。 如果不提供 `sendParam.from` 或 `kip7.options.from`，就會發生錯誤。

請注意，此方法將向 kaia 網絡提交交易，而 kaia 網絡將向發送方收取交易費。

**參數**

| 名稱        | 類型                                | 描述                                                                                                |
| --------- | --------------------------------- | ------------------------------------------------------------------------------------------------- |
| amounts   | BigNumber \\| string \\| number | 要銷燬的代幣數量。                                                                                         |
| sendParam | object                            | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意** `index`參數接受`number`類型，但如果輸入值超出了number.MAX_SAFE_INTEGER的範圍，可能會導致意外結果或錯誤。 在這種情況下，建議使用 `BigNumber` 類型，特別是對於 `uint256` 大小的數值輸入值。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP37 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given 
> kip7.burn(1000, { from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0x7cf9e982510d17a2fd5fca3e7a6f9ce5a25a9da6ba81d51b33129fb7fb93e0ae',
    blocknumber: 10495,
    contractAddress: null,
    from: '0x2f7dc98bd93a0544b03d6ff428a6f4ae04b32676',
    ...
    status: true,
    to: '0x0f681dbc120d9d3be997565626cd87f049f5c405',
    ...
    events: {
        Transfer: {
            address: '0x0f681Dbc120D9d3BE997565626CD87F049f5C405',
            blocknumber: 10495,
            transactionHash: '0x4f2de0b4310c40eeef20ae8e8d129d209195975792de86e1cd00f2345789c9f7',
            transactionIndex: 0,
            blockHash: '0x7cf9e982510d17a2fd5fca3e7a6f9ce5a25a9da6ba81d51b33129fb7fb93e0ae',
            logIndex: 0,
            id: 'log_20f6c253',
            returnValues: {
                '0': '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                '1': '0x0000000000000000000000000000000000000000',
                '2': '1000',
                from: '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                to: '0x0000000000000000000000000000000000000000',
                value: '1000',
            },
            event: 'Transfer',
            signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            raw: {
                data: '0x00000000000000000000000000000000000000000000000000000000000003e8',
                topics: [ '0xddf25...', '0x00...676', '0x00...000' ],
            },
        },
    },
}

// Using FD transaction to execute the smart contract
> kip7.burn(1000, {
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.burn(1000).then(console.log)
```

## kip7.burnFrom<a id="kip7-burnfrom"></a>

```javascript
kip7.burnFrom(account, amount [, sendParam])
```

從 `account` 中銷燬給定數量的代幣。 sendParam.from "或 "kip7.options.from "中指定的發件人的津貼將與 "賬戶 "餘額一起減少。

請注意，此方法將向 kaia 網絡提交交易，而 kaia 網絡將向發送方收取交易費。

**參數**

| 名稱        | 類型                             | 描述                                                                                                |
| --------- | ------------------------------ | ------------------------------------------------------------------------------------------------- |
| account   | string                         | 擁有代幣的賬戶地址，該代幣將通過津貼機制燒燬。                                                                           |
| amount    | Buffer \\| string \\| number | 要銷燬的代幣數量。                                                                                         |
| sendParam | object                         | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意** `index`參數接受`number`類型，但如果輸入值超出了number.MAX_SAFE_INTEGER的範圍，可能會導致意外結果或錯誤。 在這種情況下，建議使用 `BigNumber` 類型，特別是對於 `uint256` 大小的數值輸入值。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP37 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given 
> kip7.burnFrom('0x{address in hex}', 1000, { from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0xcd9f3d00856a056e54697cde2621d8af779c11378c422700510d6ebf65bea0a8',
    blocknumber: 11371,
    contractAddress: null,
    from: '0x1b7bdfcfb0008d0c958da13f2dc30388271e9ef0',
    ...
    status: true,
    to: '0x50fafa2b059d26c47d26c35ccb3cd3b856ecc852',
    ...
    events: {
        Transfer: {
            address: '0x50fAFa2B059d26C47D26c35Ccb3Cd3b856Ecc852',
            blocknumber: 11371,
            transactionHash: '0xed37eafc35272bd7c45695b4b94c578c681a1800b1612ca82d0e4e595e947f27',
            transactionIndex: 0,
            blockHash: '0xcd9f3d00856a056e54697cde2621d8af779c11378c422700510d6ebf65bea0a8',
            logIndex: 0,
            id: 'log_a7263788',
            returnValues: {
                '0': '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                '1': '0x0000000000000000000000000000000000000000',
                '2': '10000',
                from: '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                to: '0x0000000000000000000000000000000000000000',
                value: '10000',
            },
            event: 'Transfer',
            signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            raw: {
                data: '0x0000000000000000000000000000000000000000000000000000000000002710',
                topics: [ '0xddf25...', '0x00...676', '0x00...000' ],
            },
        },
        Approval: {
            address: '0x50fAFa2B059d26C47D26c35Ccb3Cd3b856Ecc852',
            blocknumber: 11371,
            transactionHash: '0xed37eafc35272bd7c45695b4b94c578c681a1800b1612ca82d0e4e595e947f27',
            transactionIndex: 0,
            blockHash: '0xcd9f3d00856a056e54697cde2621d8af779c11378c422700510d6ebf65bea0a8',
            logIndex: 1,
            id: 'log_4ca1aac4',
            returnValues: {
                '0': '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                '1': '0x1B7BdfCFb0008D0C958dA13F2dc30388271E9eF0',
                '2': '0',
                owner: '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                spender: '0x1B7BdfCFb0008D0C958dA13F2dc30388271E9eF0',
                value: '0',
            },
            event: 'Approval',
            signature: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
            raw: {
                data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                topics: [ '0x8c5be...', '0x00...676', '0x00...ef0' ],
            },
        },
    },
}

// Using FD transaction to execute the smart contract
> kip7.burnFrom('0x{address in hex}', 1000, {
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.burnFrom('0x{address in hex}', 1000).then(console.log)
```

## kip7.addPauser<a id="kip7-addpauser"></a>

```javascript
kip7.addPauser(account [, sendParam])
```

添加一個有權中止合約的暫停賬戶。

請注意，此方法將向 kaia 網絡提交交易，而 kaia 網絡將向發送方收取交易費。

**參數**

| 名稱        | 類型     | 描述                                                                                                |
| --------- | ------ | ------------------------------------------------------------------------------------------------- |
| account   | string | 將成為新暫停者的賬戶地址。                                                                                     |
| sendParam | object | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意**\* 如果給出了 `sendParam.from` 或 `kip7.options.from`，則應是具有 PauserRole 的暫停器。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP7 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given 
> kip7.addPauser('0x{address in hex}', { from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0x14bcefa90f95f5db03ed9c43a77ae910b57960f4f44c786e3a650a8ad163f67a',
    blocknumber: 16524,
    contractAddress: null,
    from: '0x2f7dc98bd93a0544b03d6ff428a6f4ae04b32676',
    ...
    status: true,
    to: '0x31fee792a85ff4d714f47a151975b4979cb47308',
    ...
    events: {
        PauserAdded: {
            address: '0x31fee792A85ff4D714F47A151975b4979CB47308',
            blocknumber: 16524,
            transactionHash: '0x9bd0cba9f5fdc3fdae4b9f40f46f11bf42314ca2518724e78be266d46a8a9f96',
            transactionIndex: 0,
            blockHash: '0x14bcefa90f95f5db03ed9c43a77ae910b57960f4f44c786e3a650a8ad163f67a',
            logIndex: 0,
            id: 'log_d847b043',
            returnValues: {
                '0': '0x6610B93bAE66F89716C3b010ad39DF476Da9234b',
                account: '0x6610B93bAE66F89716C3b010ad39DF476Da9234b',
            },
            event: 'PauserAdded',
            signature: '0x6719d08c1888103bea251a4ed56406bd0c3e69723c8a1686e017e7bbe159b6f8',
            raw: {
                data: '0x',
                topics: [ '0x6719d...', '0x00...34b' ],
            },
        },
    },
}

// Using FD transaction to execute the smart contract
> kip7.addPauser('0x{address in hex}', {
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.addPauser('0x{address in hex}').then(console.log)
```

## kip7.renouncePauser<a id="kip7-renouncepauser"></a>

```javascript
kip7.renouncePauser([sendParam])
```

放棄暫停合約的權利。 只有暫停地址可以放棄自己的暫停權。

請注意，此方法將向 kaia 網絡提交交易，而 kaia 網絡將向發送方收取交易費。

**參數**

| 名稱        | 類型     | 描述                                                                                                |
| --------- | ------ | ------------------------------------------------------------------------------------------------- |
| sendParam | object | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意**\* 如果給出了 `sendParam.from` 或 `kip17.options.from`，則應是具有 PauserRole 的暫停器。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP37 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given 
> kip7.renouncePauser({ from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0xc0b1b4914ddc8d74e8034fe86ede1b5b88a2c16ee4d678e58fac325c589713f6',
    blocknumber: 16567,
    contractAddress: null,
    from: '0x5934a0c01baa98f3457981b8f5ce6e52ac585578',
    ...
    status: true,
    to: '0x31fee792a85ff4d714f47a151975b4979cb47308',
    ...
    events: {
        PauserRemoved: {
            address: '0x31fee792A85ff4D714F47A151975b4979CB47308',
            blocknumber: 16567,
            transactionHash: '0xefc93382f5609531dd16f644cf6a3b8e086c623a9fb8038984662f7260482df6',
            transactionIndex: 0,
            blockHash: '0xc0b1b4914ddc8d74e8034fe86ede1b5b88a2c16ee4d678e58fac325c589713f6',
            logIndex: 0,
            id: 'log_e9518d2f',
            returnValues: {
                '0': '0x5934a0c01baA98F3457981b8f5ce6E52ac585578',
                account: '0x5934a0c01baA98F3457981b8f5ce6E52ac585578',
            },
            event: 'PauserRemoved',
            signature: '0xcd265ebaf09df2871cc7bd4133404a235ba12eff2041bb89d9c714a2621c7c7e',
            raw: {
                data: '0x',
                topics: [ '0xcd265...', '0x00...578' ],
            },
        },
    },
}

// Using FD transaction to execute the smart contract
> kip7.renouncePauser({
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.renouncePauser().then(console.log)
```

## kip7.pause<a id="kip7-pause"></a>

```javascript
kip7.pause([sendParam])
```

暫停與發送代幣相關的功能。

請注意，此方法將向 kaia 網絡提交交易，而 kaia 網絡將向發送方收取交易費。

**參數**

| 名稱        | 類型     | 描述                                                                                                |
| --------- | ------ | ------------------------------------------------------------------------------------------------- |
| sendParam | object | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意**\* 如果給出了 `sendParam.from` 或 `kip7.options.from`，則應是具有 PauserRole 的暫停器。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP37 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given 
> kip7.pause({ from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0xcd5e787e738a6197df871f0d651f2a9149d5ed03fdf62e918c4eed03003ea539',
    blocknumber: 18218,
    contractAddress: null,
    from: '0x2f7dc98bd93a0544b03d6ff428a6f4ae04b32676',
    ...
    status: true,
    to: '0xfc83abf47d232739dab9610c46b3f10c8022b3ef',
    ...
    events: {
        Paused: {
            address: '0xFc83ABF47d232739dAb9610C46B3F10C8022b3eF',
            blocknumber: 18218,
            transactionHash: '0x0e660b8c49e8212a69f2d68324e105b4295b534d22ac0b70263d3e54d429d1bb',
            transactionIndex: 0,
            blockHash: '0xcd5e787e738a6197df871f0d651f2a9149d5ed03fdf62e918c4eed03003ea539',
            logIndex: 0,
            id: 'log_2ab0db96',
            returnValues: {
                '0': '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                account: '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
            },
            event: 'Paused',
            signature: '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258',
            raw: {
                data: '0x0000000000000000000000002f7dc98bd93a0544b03d6ff428a6f4ae04b32676',
                topics: ['0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258'],
            },
        },
    },
}

// Using FD transaction to execute the smart contract
> kip7.pause({
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.pause().then(console.log)
```

## kip7.unpause<a id="kip7-unpause"></a>

```javascript
kip7.unpause([sendParam])
```

恢復已暫停的合約。

請注意，此方法將向 kaia 網絡提交交易，而 kaia 網絡將向發送方收取交易費。

**參數**

| 名稱        | 類型     | 描述                                                                                                |
| --------- | ------ | ------------------------------------------------------------------------------------------------- |
| sendParam | object | (可選）一個對象，包含用於發送事務的定義參數。 有關 sendParam 的更多信息，請參閱 [approve](#kip7-approve) 的參數說明。 |

**注意**\* 如果給出了 `sendParam.from` 或 `kip7.options.from`，則應是具有 PauserRole 的暫停器。

**返回價值**

`Promise` 返回 `object` - 包含事務執行結果的收據。 如果您想了解收據對象內部的屬性，請參閱 [getTransactionReceipt] 的說明。 來自 KIP37 實例的收件具有通過 ABI 解析的 "事件 "屬性，而不是 "日誌 "屬性。

**示例**

```javascript
// Send via a sendParam object with the from field given 
> kip7.unpause({ from: '0x{address in hex}' }).then(console.log)
{
    blockHash: '0xa45194ba608a0a00152f974fb1388ced326522979f4b8f19c3fab3083f1339ac',
    blocknumber: 18239,
    contractAddress: null,
    from: '0x2f7dc98bd93a0544b03d6ff428a6f4ae04b32676',
    ...
    status: true,
    to: '0xfc83abf47d232739dab9610c46b3f10c8022b3ef',
    ...
    events: {
        Unpaused: {
            address: '0xFc83ABF47d232739dAb9610C46B3F10C8022b3eF',
            blocknumber: 18239,
            transactionHash: '0x449dff9d7970bfe326091516ebb22aeaefb0bda59bc4e2577467618863e36c99',
            transactionIndex: 0,
            blockHash: '0xa45194ba608a0a00152f974fb1388ced326522979f4b8f19c3fab3083f1339ac',
            logIndex: 0,
            id: 'log_9c5a3823',
            returnValues: {
                '0': '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
                account: '0x2f7Dc98Bd93A0544B03d6ff428a6f4ae04b32676',
            },
            event: 'Unpaused',
            signature: '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa',
            raw: {
                data: '0x0000000000000000000000002f7dc98bd93a0544b03d6ff428a6f4ae04b32676',
                topics: ['0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa'],
            },
        },
    },
}

// Using FD transaction to execute the smart contract
> kip7.unpause({
    from: '0x{address in hex}'
    feeDelegation: true,
    feePayer: '0x{address in hex}'
}).then(console.log)

// Using kip7.options.from
// If the value of kip7.options.from is set, this value is used as the default value 
// unless you specify `from` in the sendParam object when sending a transaction with a kip7 instance.
> kip7.options.from = '0x{address in hex}'
> kip7.unpause().then(console.log)
```

[getTransactionReceipt]: ../caver-rpc/klay.md#caver-rpc-klay-gettransactionreceipt
