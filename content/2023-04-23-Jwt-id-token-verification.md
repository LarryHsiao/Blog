+++
date = "2023-04-23"
title = "Go 驗證 Google ID Token"
slug = "google-id-token-verification"
[taxonomies]
tags=["golang"]
+++

> **說明：** 本文由 AI（Claude Sonnet 4.6）根據我的初始筆記與想法完成。

在 Metis 後端用 Go 驗證 Firebase ID Token 時，踩了一個坑：公鑰必須先 parse 過才能使用，否則會拋出 `key is of invalid type`。

### 背景

Firebase 的 ID Token 是一個 RSA 簽名的 JWT。驗證時需要：

1. 從 Google 的公鑰端點取得當前的公鑰清單
2. 根據 token header 裡的 `kid` 選對應的公鑰
3. 用該公鑰驗證簽名

### 問題在哪

從 Google 拿回來的公鑰是 PEM 格式的字串。如果直接把字串傳進 `jwt.ParseWithClaims` 的 keyfunc，就會拿到這個錯誤：

```
key is of invalid type
```

`golang-jwt/jwt` 預期的是 `*rsa.PublicKey`，不是原始字串。

### 正確做法

在 keyfunc 裡，取到 PEM 字串之後，要先呼叫 `jwt.ParseRSAPublicKeyFromPEM()` 轉成 `*rsa.PublicKey` 再回傳：

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

    // 這步不能少：PEM 字串要 parse 成 *rsa.PublicKey
    parsedKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(publicKey))
    if err != nil {
        return nil, err
    }
    return parsedKey, nil
})
```

少了 `ParseRSAPublicKeyFromPEM`，直接 `return publicKey, nil` 就是 `key is of invalid type` 的根源。
