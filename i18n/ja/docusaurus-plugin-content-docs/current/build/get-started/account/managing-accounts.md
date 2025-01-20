# アカウント管理

## 口座リスト<a id="list-your-accounts"></a>

これは、データ・ディレクトリの下に作成されたすべてのアカウントのリストを返す。

### ken <a id="ken"></a>

コマンドラインから、次のようにCLIを呼び出す：

```bash
$ ken account list --datadir <DATADIR>
$ ken account list --datadir ~/kend_home
Account #0: {bfc22a57999459b0c2ce6337deb9287e7a970e02} keystore:///Users/username/kend_home/keystore/UTC--2019-03-26T07-02-58.524962000Z--bfc22a57999459b0c2ce6337deb9287e7a970e02
Account #1: {47bd2e9565cbe1789454718d6cf1778d7ea557aa} keystore:///Users/username/kend_home/keystore/UTC--2019-03-26T07-04-44.840061000Z--47bd2e9565cbe1789454718d6cf1778d7ea557aa
```

**注**\*：他のノードからキーストア・ファイルをコピーしたり、ファイルを削除したりすると、返されるアカウント・リストの順序が変わることがあります。 したがって、インデックスに依存しないようにするか、キーストア・ファイルをコピーまたは削除した場合は、スクリプトでアカウント・インデックスをチェックして更新するようにしてください。

### JavaScriptコンソール<a id="javascript-console"></a>

コンソールを使用する場合

```javascript
> klay.accounts
["bfc22a57999459b0c2ce6337deb9287e7a970e02", "47bd2e9565cbe1789454718d6cf1778d7ea557aa"]
```

## アカウントのロック解除<a id="unlock-accounts"></a>

アカウントをインタラクティブに使用しない場合は、ロックを解除する必要があります。

### ken <a id="ken"></a>

You can unlock accounts and start the EN on the command line with the `--unlock "{address},{address}"` option which takes a comma-separated list of accounts (in hex or index) as an argument so you can unlock the accounts programmatically for one session. これは、RPC経由でdAppsからアカウントを使用したい場合に便利です。 `unlock`はリストの最初のアカウントのロックを解除する。 これは、プログラムでアカウントを作成した場合に便利で、実際のアカウントを知らなくてもロックを解除できる。

アカウントを作成し、ロックを解除した状態でノードを開始する：

```bash
$ ken account new --password <(echo this is not secret) --datadir <DATADIR>
$ ken --password <(echo "this is not secret") --unlock primary --datadir <DATADIR> --rpccorsdomain localhost --verbosity 6 2>> log.log
```

If you want to start a node with a specific account unlocked, you can use an address or an index which refers to the address position in the account list (and corresponds to the order of creation).

```bash
$ ken --unlock "0" --datadir <DATADIR>
$ ken --unlock "2" --datadir <DATADIR>
$ ken --unlock "bfc22a57999459b0c2ce6337deb9287e7a970e02" --datadir <DATADIR>
```

コマンドラインを使えば、複数のアカウントのロックを解除できる。 この場合、unlockの引数は、アカウント・アドレスまたはインデックスをカンマで区切ったリストである。

```bash
$ ken --unlock "0x407d73d8a49eeb85d32cf465507dd71d507100c1,0,5,e470b1a7d2c9c5c6f03bbaa8fa20db6d404a0c32" --datadir <DATADIR>
```

この構文を非対話的に使用する場合、パスワードファイルには、該当するアカウントのパスワードを1行に1つずつ記述する必要がある。

### JavaScriptコンソール<a id="javascript-console"></a>

On the console you can also unlock accounts (one at a time) for a duration (in seconds).

```javascript
> personal.unlockAccount(address, "password", 300)
```

コンソールの履歴が記録されるため、アカウントが危険にさらされる可能性があります。 あなたは警告されている。

## 口座残高の確認<a id="check-account-balance"></a>

### ken <a id="ken"></a>

該当なし

### JavaScriptコンソール<a id="javascript-console"></a>

口座残高の確認

```javascript
> klay.fromPeb(klay.getBalance("{account}"), "KLAY")
6.5
```

JavaScript関数ですべての残高を表示する：

```javascript
function checkAllBalances() {
    var totalBal = 0;
    for (var acctNum in klay.accounts) {
        var acct = klay.accounts[acctNum];

        var acctBal = klay.fromPeb(klay.getBalance(acct), "KLAY");
        totalBal += parseFloat(acctBal);

        console.log("klay.accounts[" + acctNum + "]: \t" + acct + " \tbalance: " + acctBal + "KLAY");

    }

    console.log("Total balance: " + totalBal + " KLAY");
};
```

と実行することができる：

```javascript
> checkAllBalances();
klay.accounts[0]: 0xd1ade25ccd3d550a7eb532ac759cac7be09c2719  balance: 63.11848 KLAY
klay.accounts[1]: 0xda65665fc30803cb1fb7e6d86691e20b1826dee0  balance: 0 KLAY
klay.accounts[2]: 0xe470b1a7d2c9c5c6f03bbaa8fa20db6d404a0c32  balance: 1 KLAY
klay.accounts[3]: 0xf4dd5c3794f1fd0cdc0327a83aa472609c806e99  balance: 6 KLAY
```

この関数は `ken` を再起動すると消えてしまうので、よく使う関数を保存しておくと後で呼び出すときに便利である。

まず、`checkAllBalances()`関数の定義をコンピューター上のファイルに保存する。 例えば、`/Users/username/klayload.js`である。 その後、対話型コンソールからファイルをロードする：

```javascript
> loadScript("/Users/username/klayload.js")
true
```

このファイルは、あたかも手動でコマンドを入力したかのように、あなたのJavaScript環境を変更する。 自由に実験してほしい！
