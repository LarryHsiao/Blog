+++
date = "2023-01-31"
title = "一次查驗沒辦法連線WebSocket的經驗"

+++

使用語言Jvm(Java/Kotlin)，連線WebSocket時(OkHttp)遇到加密protocol版本 沒辦法連線的問題，以及查驗的經驗分享。

首先在連線時就失敗了，我收到了以下的信息。

```bash
javax.net.ssl.SSLHandshakeException: Received fatal alert: protocol_version
	at java.base/sun.security.ssl.Alert.createSSLException(Alert.java:131)
	at java.base/sun.security.ssl.Alert.createSSLException(Alert.java:117)
	at java.base/sun.security.ssl.TransportContext.fatal(TransportContext.java:339)
```

Google了一下說的似乎就是加密協定版本的問題。
於是乎呢，我將Client端的加密協定限制使用`TLSv1.2`、`TLSv1.3`，結果還是如上圖。
繼續奮鬥了一個下午，已經幾乎放棄了。最後至少看一下伺服器使用的是哪一個版本的協定吧...(至少自己怎麼死的要看清楚)

```bash
openssl s_client -connect host_name -tls1_3 
#-tls1 -tls1_1 -tls1_2個別試試
```

使用了`TLSv1.2`檢查發現，沒有憑證

```bash
$ openssl s_client -connect host_name_in_the_house -tls1_2
CONNECTED(000001AC)
---
no peer certificate available
---
No client certificate CA names sent
---
SSL handshake has read 5 bytes and written 217 bytes
Verification: OK
---
New, (NONE), Cipher is (NONE)
Secure Renegotiation IS NOT supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
SSL-Session:
    Protocol  : TLSv1.2
    Cipher    : 0000
    Session-ID:
    Session-ID-ctx:
    Master-Key:
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    Start Time: 1676488066
    Timeout   : 7200 (sec)
    Verify return code: 0 (ok)
    Extended master secret: no
---
write:errno=10054
```

反倒是`TLSv1`有憑證呢
```bash
$ openssl s_client -connect host_name_in_the_house -tls1
CONNECTED(00000154)
---
Certificate chain
 0 s:C = TW, ST = Taiwan, L = New Taipei, O = "The house", OU = IT, CN = *.the.house
   i:C = TW, O = TAIWAN-CA, OU = Secure SSL Sub-CA, CN = TWCA Secure SSL Certification Authority
 1 s:C = TW, O = TAIWAN-CA, OU = Secure SSL Sub-CA, CN = TWCA Secure SSL Certification Authority
   i:C = TW, O = TAIWAN-CA, OU = Root CA, CN = TWCA Global Root CA
---
Server certificate
-----BEGIN CERTIFICATE-----
MIIGxTCCBa2gAwIBAgIQR+YAAAAFJJl77h2NP1Q3zjANBgkqhkiG9w0BAQsFADBv
MQswCQYDVQQGEwJUVzESMBAGA1UEChMJVEFJV0FOLUNBMRowGAYDVQQLExFTZWN1
cmUgU1NMIFN1Yi1DQTEwMC4GA1UEAxMnVFdDQSBTZWN1cmUgU1NMIENlcnRpZmlj
YXRpb24gQXV0aG9yaXR5MB4XDTIyMDIxMzIzMjMwM1oXDTIzMDMxNjE1NTk1OVow
fDELMAkGA1UEBhMCVFcxDzANBgNVBAgTBlRhaXdhbjETMBEGA1UEBxMKTmV3IFRh
aXBlaTEkMCIGA1UEChMbQ01PTkVZIFRFQ0hOT0xPR1kgQ08uLCBMVEQuMQ

....(略)
```

原來...伺服器的加密版本偏舊了呢，使用的是1999年的 `TLSv1`，這個東西舊到我也沒辦法隨便找一台機器簡單設定就可以驗證，許多JDK也都預設將這個加密協定預設關閉了。說到這邊我幾乎可以確定所謂的protocol版本問題的起因就在這邊了呢。好了，我也該睡覺了。


晚安💤

