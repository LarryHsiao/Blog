+++
date = "2023-04-23"
title = "Go で Google ID Token を検証する"
slug = "google-id-token-verification"
[taxonomies]
tags=["golang"]
+++

> **注：** 本記事は、私の初期メモと考えをもとに AI（Claude Sonnet 4.6）が仕上げたものです。

Go で Firebase ID Token を検証するときにハマった点：公開鍵は使う前に必ず parse しないと `key is of invalid type` が発生する。

### 背景

Firebase ID Token は RSA 署名付きの JWT だ。検証には以下が必要：

1. Google の公開鍵エンドポイントから現在の鍵リストを取得
2. トークンヘッダーの `kid` フィールドで対応する鍵を選択
3. その鍵で署名を検証

### 問題

Google から返ってくる公開鍵は PEM 形式の文字列だ。この文字列を `jwt.ParseWithClaims` の keyfunc にそのまま渡すと：

```
key is of invalid type
```

`golang-jwt/jwt` が期待するのは `*rsa.PublicKey` であって、生の文字列ではない。

### 修正方法

keyfunc の中で PEM 文字列を取得した後、`jwt.ParseRSAPublicKeyFromPEM()` を呼んで `*rsa.PublicKey` に変換してから返す：

```go
token, err := jwt.ParseWithClaims(rawToken, &claims, func(token *jwt.Token) (interface{}, error) {
    if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
        return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
    }
    keys, err := google.GetKeys(httpClient).Execute()
    if err != nil {
        return nil, err
    }
    kid := fmt.Sprintf("%s", token.Header["kid"])
    publicKey := fmt.Sprintf("%s", keys[kid])

    // この一行が必須：PEM 文字列を *rsa.PublicKey に変換する
    parsedKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(publicKey))
    if err != nil {
        return nil, err
    }
    return parsedKey, nil
})
```

`ParseRSAPublicKeyFromPEM` を省いて生文字列をそのまま返すと、それが `key is of invalid type` の原因になる。
