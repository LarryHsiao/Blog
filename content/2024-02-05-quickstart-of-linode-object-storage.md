+++
date = "2024-02-05"
title = "快速上手 Linode Object Storage"
slug = "qucikstart-of-linode-object-storage-using-http-api"
[taxonomies]
tags=["Linode", "Object Storage", "S3", "Quickstart"]
+++

S3 Object Stroage我想大家多少都有聽過或者使用過，當然也對於那高昂的使用費多有耳聞．
剛好Linode提供了可以相容於S3又不用那麼多費用的Object Storage服務．這邊我就來分享透過API快速進入Object Storage的世界，希望能為你省去看文件/找文件/推敲文件脈絡的功夫．
(Web API的操作非常基本，進階的操作建議研讀官方文件)

### 使用Linode Object Storage api運作流程：

1. 跟Linode Object Storage告知我們要對某個位置的檔案做新增/刪除/下載（PUT/DELETE/GET)
0. Linode Object Storage告訴我們該位置的 pre-signed url，並且在有限時間內有效
0. 對於該url做我們在第一個步驟告知的操作

### API request 範例：

已上傳檔案名為`sample.png`的圖檔到`sampleDir`資料夾為例

##### 告知操作(我要新增檔案)

```bash
# token -> 這個範例使用Linode Web設定帳號的Personal API token來存取(Linode Web點擊頭像-> API token)，也可以透過OAuth
# cluster_id -> 所在地區Cluster Id，看起來與地區有關 
# bucket_id -> 你的bucket名稱
# 以Linode Web頁面提供的Bucket的Url可以推測出來

# 以此url為例: object-storage-test.jp-osa-1.linodeobjects.com
# bucket_id: object-storage-test
# cluster_id: jp-osa-1

curl --request POST \
  --url https://api.linode.com/v4/object-storage/buckets/{{cluster_id}}/{{bucket_id}}/object-url \
  --header 'Authorization: Bearer {{token}}' \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.6.0' \
  --data '{
	"method": "PUT",
	"name": "sampleDir/sample.png",
	"content_type": "image/png"
}'
```

###### 取得Url

Linode Object Storage會回覆我們

```json
{
  "url": "https://jp-osa-1.linodeobjects.com:443/object-storage-test/sampleDir/sample.png?Signature=nkASrS%2B3S7QK6AYM8oZPifqfdsfYso%3D&Expires=1706858429&AWSAccessKeyId=B478147FEOIRTA4DXPO",
  "exists": false
}
```

###### 上傳檔案

我們就根Linode回傳給我們的Url做我們預告的操作即可

```bash
curl --request PUT \
  --url 'https://jp-osa-1.linodeobjects.com:443/object-storage-test/sampleDir/sample.png?=&Signature=nkASrS%2B3S7QK6AYM8oZPifqfdsfYso%3D&Expires=1706858434&AWSAccessKeyId=B478147FEOIRTA4DXPO' \
  --header 'Content-Type: image/png' \
  --data '{{the data binary}}'
```

以上就完成了上傳的操作了，其他如下載與刪除也是一樣的流程，只是Http method改成GET或者DELETE
