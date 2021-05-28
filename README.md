<img src="https://user-images.githubusercontent.com/5424267/119736375-75dd1f00-be32-11eb-8012-ebece6238f7c.png" alt="Gugu logo" width="100" height="100" align="right" />


# Gugu
> An Eggjs+MongoDB+GraphQL based web server implementation for children myopia control community application.
>
> related projects - [WeChat Mini Program](https://github.com/zhangqi444/gugu-myopic-patients-community-wechat-miniprogram) | [CMS](https://github.com/zhangqi444/gugu-myopic-patients-community-cms-admin)
> 
> ‼️ **This project is better to be used as sample code for learning purpose, instead of an application in production.**

<p align="left">
  <img src="https://img.shields.io/badge/node-%3E%3D6.0.0-brightgreen"/>
  <img src="https://img.shields.io/badge/eggjs-%3E%3D1.20.0-brightgreen"/>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="Gugu is released under the MIT license." />
  <img src="https://img.shields.io/badge/maintained%3F-no-red.svg" alt="Gugu is not under maintained anymore." />
  <img src="https://img.shields.io/badge/ask%20me-anything-1abc9c.svg" alt="Ask Me Anything." />
</p>


<a href="https://github.com/zhangqi444/gugu-myopic-patients-community-backend/" target="_blank">Doc</a>
|
<a href="https://github.com/zhangqi444/gugu-myopic-patients-community-backend/blob/master/README-zh-CN.md" target="_blank">中文文档</a>

## Background

### What's myopic control in children？

Myopia (or nearsightedness) is very common. One out of two people (50%) have it. With myopia, the eye is longer than normal from front to back, or the cornea (the clear window at the front of the eye) is too steeply curved. This makes things that are far away from you look blurry. Myopia is corrected with glasses, contact lenses or surgery in some cases. Having myopia can increase your chances of having some eye problems later, like cataract, glaucoma and retinal detachment.

Studies show myopia is becoming more common among children. While there is no proven direct link, research suggests that children who spend more time indoors doing near-focused activities (such as computer work, video games, and reading) have higher rates of myopia than those who spend more time outdoors.

Doctors are looking at ways to slow the progression of myopia in children. While myopia cannot be reversed, the goal of treatment is to keep it from getting worse. This can protect a child’s eye health in the future, despite still needing to wear glasses or contact lenses.[1]

[1]. Myopia Control in Children. (2020). Retrieved 28 May 2021, from https://www.aao.org/eye-health/treatments/myopia-control-in-children

Please refer to [this](https://github.com/zhangqi444/gugu-myopic-patients-community-wechat-miniprogram) for more information.

## Tech stack

- [eggjs](https://github.com/eggjs/egg) 
- [mongodb](https://www.mongodb.com/)
- [redis](https://redis.io/)
- [elasticsearch](https://www.elastic.co/)

## installation
1. install redis
   1. start redis - `sudo systemctl start redis`
2. install elasticsearch [RPM](https://www.elastic.co/guide/en/elasticsearch/reference/current/rpm.html)
   1. start elasticsearch - `sudo systemctl start elasticsearch.service`
   2. open `http://localhost:9200/articles/_mapping?pretty=true`
3. install mongodb
   1. `makir /data && mkdir /data/mongodb`
   2. start mongodb deamon - `mongod --auth --fork --dbpath /data/mongodb --logpath /var/log/mongodb/mongod.log`
4. install node
5. install nginx(not necessary for local development)
   1. config nginx
   2. start nginx - `nginx`

## Get start

### Environment varibles
```shell
export JWT_SECRET_KEY='YOUR_JWT_SECRET_KEY' &&
export WECHAT_MINI_APP_ID='YOUR_WECHAT_NIMI_APP_ID' &&
export WECHAT_MINI_APP_SECRET='YOUR_WECHAT_MINI_APP_SECRET' &&
export MONGODB_URL='YOUR_MOGONDB_URL' &&
export ALIYUN_USER_BUCKET='YOUR_ALIYUN_USER_BUCKET' &&
export ALIYUN_BUCKET='YOUR_ALIYUN_BUCKET' &&
export ALIYUN_ACCESS_KEY_SECRET='YOUR_ALIYUN_ACCESS_KEY_SECRET' &&
export ALIYUN_ACCESS_KEY_ID='YOUR_ALIYUN_ACCESS_KEY_ID' && 
export ALIYUN_REGION='YOUR_ALIYUN_REGION'
```

### Local development
Please get the permission to access the remote host first. 

```shell
# Connect to the host by using SSH Tunnel to bridge the database port to your local.
ssh -L27018:localhost:27017 root@x.x.x.x
# Start the local server.
npm install 
npm run dev
```
open `http://localhost:7001/graphql`

### Gamma environment deployment
```shell
npm run stop-gamma
npm install
npm run start-gamma
```
open `http://localhost:7001/graphql`

### Prod environment deployment
```shell
npm run stop
npm install
npm run start
```

open `http://localhost:7777/graphql`

## FAQ
### 1. how to use [elasticvue](https://app.elasticvue.com/setup) to configure the elasticsearch?

Please add below configurations to the `/etc/elasticsearch/elasticsearch.yml`
``` 
# allow CORS requests from https://app.elasticvue.com
http.cors.enabled: true
http.cors.allow-origin: "https://app.elasticvue.com"
```

### 2. how to backup the database?？
You could use [mongoexport](https://docs.mongodb.com/database-tools/mongoexport/) or any other GUI tools if you know.
```
export MONGODB_URL="MONGODB_URL"
mongoexport --uri=MONGODB_URL --collection=articles --out=articles.json
```
Or you could consider [mongodump](https://docs.mongodb.com/database-tools/mongorestore/).
```
mongodump --uri=MONGODB_URL -o=gugudump
```

### 3. how to setup the auto database backup？

https://pranavprakash.net/2017/02/04/automate-mongodb-backups-using-cron-and-shell-script/

Please refer to the script in `script/mongodb_dump.sh`.

### 4. how to use the GUI tool to manage the ElasticSearch deployed in remote?

```shell
# use SSH Tunnel to bridge the port to your local.
ssh -L9201:localhost:9200 root@x.x.x.x`
```

Visit `https://app.elasticvue.com/` and connect to localhost with port as 9201。

### 5. how to setup the MongoDB database?

  1. [enable auth and create admin user](https://docs.mongodb.com/manual/tutorial/enable-authentication/)
     1. `mongo`
     2. `use admin`
     3. `db.createUser({ user: "opsAdmin", pwd: passwordPrompt(), roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]})`
  2. create the new database
  3. [create the admin roles for the new database](https://docs.mongodb.com/manual/tutorial/manage-users-and-roles/)

### 6. how to config Nginx?
```
server {
        listen 443;
        server_name YOUR_DOMAIN; # your domain
        # ssl config
        ssl on;
        ssl_certificate YOUR_CERTIFICATE_CERT; # your certificate's crt file name
        ssl_certificate_key YOUR_CERTIFICATE_KEY; # your certificate's key file name
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;

        location / {
          proxy_pass http://127.0.0.1:7001;
        }
    }
```

### 7. project template

This repo is created from [egg-graphql-boilerplate](https://github.com/freebyron/egg-graphql-boilerplate).

## Discussions

Please open an issue for any questions，and I will respond as soon as possible。

## Contributors

[@zhangqi444](https://github.com/zhangqi444), [@happyerqi](https://github.com/happyerqi)

## 📄 License

This project is MIT licensed.

