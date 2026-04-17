+++
date = "2023-04-23"
title = "Verifying Google ID Tokens in Go"
slug = "google-id-token-verification"
[taxonomies]
tags=["golang"]
+++

> **Note:** This article was completed by AI (Claude Sonnet 4.6) from my initial notes and thoughts.

When verifying Firebase ID Tokens in Go, there's one gotcha: the public key must be parsed before use, otherwise you'll get `key is of invalid type`.

### Background

A Firebase ID Token is an RSA-signed JWT. Verification requires:

1. Fetching the current public key list from Google's public key endpoint
2. Selecting the right key using the `kid` field from the token header
3. Verifying the signature with that key

### The problem

Google returns public keys as PEM-encoded strings. If you pass that string directly into the keyfunc of `jwt.ParseWithClaims`, you get:

```
key is of invalid type
```

`golang-jwt/jwt` expects an `*rsa.PublicKey`, not a raw string.

### The fix

Inside the keyfunc, after fetching the PEM string, call `jwt.ParseRSAPublicKeyFromPEM()` to convert it to `*rsa.PublicKey` before returning:

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

    // This step is mandatory: parse the PEM string into *rsa.PublicKey
    parsedKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(publicKey))
    if err != nil {
        return nil, err
    }
    return parsedKey, nil
})
```

Skipping `ParseRSAPublicKeyFromPEM` and returning the raw string directly is exactly what causes `key is of invalid type`.
