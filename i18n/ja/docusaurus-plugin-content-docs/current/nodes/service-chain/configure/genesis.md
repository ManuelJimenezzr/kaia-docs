# ジェネシスファイル

このページでは、`genesis.json`ファイルの詳細について説明する。

## ジェネシスのJSONファイル構造<a id="genesis-json-file-structure"></a>

genesis.json\`ファイルの構造は以下の表のとおりである。

| フィールド名     | 説明                                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| config     | blokchainのコンフィギュレーション。 Config](#config) の項を参照。                      |
| nonce      | (deprecated) This field is derived from the Ethereum, but not used in Klaytn. |
| timestamp  | ブロックが作成されたunix時間。                                                                                                |
| extraData  | 署名者の虚栄心とRLPエンコードされたistanbulの追加データを含むデータ結合フィールドで、バリデータリスト、提案者シール、コミットシールを含む。                                      |
| gasLimit   | ブロック内で使用されるガスの最大量。                                                                                               |
| difficulty | (deprecated) This field is derived from the Ethereum, but not used in Klaytn. |
| mixhash    | (deprecated) This field is derived from the Ethereum, but not used in Klaytn. |
| coinbase   | マイナーが報酬を受け取るアドレス。 このフィールドは Clique コンセンサスエンジンのみに使用される。                                                            |
| alloc      | 定義済みのアカウント。                                                                                                      |
| number     | ブロック番号フィールド。                                                                                                     |
| gasUsed    | ブロックに使用されるガスの量。                                                                                                  |
| parentHash | 前のブロックのハッシュ値。                                                                                                    |

### Config <a id="config"></a>

config\`フィールドはチェーンに関連する情報を格納する。

| フィールド名                  | 説明                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------- |
| chainId                 | これは現在のチェーンを識別し、リプレイ攻撃を防ぐために使用される。                                                      |
| istanbulCompatibleBlock | イスタンブール・チェンジが適用されるブロック番号。                                                              |
| istanbul, clique        | コンセンサスエンジンのタイプ。                                                                        |
| unitPrice               | 単価。                                                                                    |
| deriveShaImpl           | トランザクションハッシュとレシートハッシュを生成するメソッドを定義する。                                                   |
| governance              | ネットワークのガバナンス情報。 ガバナンス](#governance)の項を参照。 |

### extraData <a id="extradata"></a>

フィールド `extraData` は提案者のバニティとRLPでエンコードされたistanbulのエクストラデータを連結したものである：

- プロポーザ・バニティは32バイトのデータで、任意のプロポーザ・バニティ・データを含む。
- 残りのデータは、RLPエンコードされたイスタンブールの追加データである：
  - バリデータ: バリデータの昇順リスト。
  - 捺印：ヘッダーの提案者署名。 genesis.json`の場合は、65個の `0x0\` で初期化されたバイト配列である。
  - CommittedSeal: コンセンサス証明としてのコミットメント署名シールのリスト。 genesis.json\`の場合は空の配列である。

\*\*例

| フィールド         | タイプ                                                                                                              | 価値                                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| バニティー         | 32バイトの16進文字列                                                                                                     | 0x0000000000000000000000000000000000000000000000000000000000000000                                                                          |
| Validators    | []address                                                    | [0x48009b4e20ec72aadf306577cbe2eaf54b0ebb16,0x089fcc42fd83baeee4831319375413b8bae3aceb] |
| Seal          | 65要素のバイト配列                                                                                                       | [0x0,...,0x0]                           |
| CommittedSeal | [][]byte | []                                                                                      |

上記のデータを持つ`extraData`は、次のようにして作成される。

```
concat('0x',Vanity,RLPEncode({Validators,Seal,CommittedSeal}))
```

ここで、`concat`は文字列の連結関数であり、`RLPEncode`は与えられた構造体をRLPエンコードされた文字列に変換する関数である。

With this function, the output `extraData` for this example is 0x0000000000000000000000000000000000000000000000000000000000000000f86fea9448009b4e20ec72aadf306577cbe2eaf54b0ebb1694089fcc42fd83baeee4831319375413b8bae3acebb8410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0.

## コンセンサス・エンジン<a id="consensus-engine"></a>

The available consensus engines for Klaytn network are Clique and Istanbul. 各エンジンの説明は以下の通り。

### Clique <a id="clique"></a>

clique\` フィールドには、Proof-Of-Authority (POA) ベースの封印のための設定が格納される。

| フィールド  | 説明                             |
| ------ | ------------------------------ |
| period | 連続するブロック間の最小時間間隔（単位：秒）。        |
| epoch  | 票をリセットし、チェックポイントとしてマークするブロック数。 |

### Istanbul <a id="istanbul"></a>

istanbul\`フィールドには、イスタンブールを拠点とするシーリングの設定が保存される。

| フィールド  | 説明                                                                       |
| ------ | ------------------------------------------------------------------------ |
| epoch  | チェックポイントとなる票をリセットするブロック数。                                                |
| policy | ブロック提案者の選択方針。 [0：ラウンドロビン、1：スティッキー、2：ウェイトランダム］。 |
| sub    | 委員会の規模                                                                   |

## Governance <a id="governance"></a>

governance\`フィールドはネットワークのガバナンス情報を格納する。

| フィールド          | 説明                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| governanceMode | 3つのガバナンス・モードのうちの1つ。 [`none`, `single`, `ballot`]                |
| governingNode  | 指定管理ノードのアドレス。 ガバナンスモードが`シングル`の場合のみ機能する。                                                                             |
| reward         | It stores the reward configuration. 報酬](#reward)の項を参照。 |

### Reward <a id="reward"></a>

reward\`フィールドはネットワークのトークンエコノミーに関する情報を格納する。

| フィールド                  | 説明                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------ |
| mintingAmount          | Amount of peb minted when a block is generated. 値にはダブルクォーテーションが必要です。 |
| ratio                  | で区切られた `CN/KIR/PoC` の分配率。 すべての値の合計は100でなければならない。                                     |
| useGiniCoeff           | GINI係数を使うかどうか。                                                                       |
| deferredTxFee          | ブロックのTX料金を分配する方法。                                                                    |
| stakingUpdateInterval  | ステーキング情報を更新するブロックの高さでの時間間隔。                                                          |
| proposerUpdateInterval | 提案者情報を更新するブロックの高さでの時間間隔。                                                             |
| minimumStake           | Minimum amount of peb to join Core Cell Operators.                   |

## 例<a id="example"></a>

```
{
    "config": {
        "chainId": 2019,
        "istanbulCompatibleBlock": 0,
        "istanbul": {
            "epoch": 604800,
            "policy": 2,
            "sub": 13
        },
        "unitPrice": 25000000000,
        "deriveShaImpl": 2,
        "governance": {
            "governingNode": "0x46b0bd6380005952759f605d02a6365552c776f3",
            "governanceMode": "single",
            "reward": {
                "mintingAmount": 6400000000000000000,
                "ratio": "50/40/10",
                "useGiniCoeff": true,
                "deferredTxFee": true,
                "stakingUpdateInterval": 86400,
                "proposerUpdateInterval": 3600,
                "minimumStake": 5000000
            }
        }
    },
    "nonce": "0x0",
    "timestamp": "0x5c9af60e",
    "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000f89af85494aeae0ab623d4118ac62a2decc386949b5ce67ce29446b0bd6380005952759f605d02a6365552c776f394699b607851c878e29499672f42a769b71f74be8e94e67598eb5831164574c876994d53f63eab4f36d7b8410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0",
    "gasLimit": "0xe8d4a50fff",
    "difficulty": "0x1",
    "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "alloc": {
        "0000000000000000000000000000000000000400": {
            "code": "0x6080604052600436106101505763ffffffff60e00a165627a7a7230582093756fe617053766b158f7c64998c746eb38f0d5431cc50231cc9fb2cd1fd9950029",
            "balance": "0x0"
        },
        "46b0bd6380005952759f605d02a6365552c776f3": {
            "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
        },
        "699b607851c878e29499672f42a769b71f74be8e": {
            "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
        },
        "aeae0ab623d4118ac62a2decc386949b5ce67ce2": {
            "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
        },
        "e67598eb5831164574c876994d53f63eab4f36d7": {
            "balance": "0x446c3b15f9926687d2c40534fdb564000000000000"
        }
    },
    "number": "0x0",
    "gasUsed": "0x0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```
