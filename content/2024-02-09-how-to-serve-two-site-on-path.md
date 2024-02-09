+++
date = "2024-02-09"
title = "如何使用Nginx將多個Web app架設到子path上"
slug = "how-to-host-multiple-site-on-path"
[taxonomies]
tags=["Nginx", "Quickstart"]
+++

這邊分享個方法讓你能夠在不打擾MIS或者不需要新的subdomain的情況下，架設多個互不相關的app在不同的path上。

首先，嚴格來講，你還是會個別使用1個port給每個app。但是透過Nginx的`rewrite`，你可以讓你的app互相切開互不受影響。(沒有301或302的轉導向)

首先，我們先將兩個app找個port吧

```bash
# app1
server{
    listen       8081;
    listen  [::]:8081;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html/app1
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}

# app2 
server{
    listen       8082;
    listen  [::]:8082;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html/app2
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

目前還沒有什麼特別的，接著就是重點了
這邊以 `sub-app` 路徑為例

```
server {
    listen       80; 
    listen  [::]:80;
    server_name  localhost;

    location ^~ /sub-app/ { // 指定位置
        rewrite /sub-app/(.*) /$1  break; # 加上這行轉導向所有符合這個sub-app開頭的網址，並且不讓其他的規則接走。如下方的root位址
        proxy_pass http://127.0.0.1:8082; # app2
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location ^~ / { # app1  # 因為app1是放在root底下故不用rewrite相關的敘述
        proxy_pass http://127.0.0.1:8081; # app1
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

```

##### 備註

以上方法我使用來解決我要在同個hostname上面架設多個Flutter app，希望能幫得上需要快速解的夥伴，詳細參數說明可以參考官方的文件。

P.S. Flutter web 在建置時要加上`--base-href=/sub-app/` 這個參數才會正常運作。我想各個Framework可以找一下相對應的設定root path機制。

```bash
flutter build web --release --base-href=/sub-app/
```


