# 個人行事曆
## 功能
### 前台
* 使用者可以註冊/登入/登出網站
* 使用者可以在瀏覽所有書籍與個別書籍詳細資料
* 在瀏覽所有書籍資料時，可以用分類篩選書籍
* 使用者可以對書籍留下評論
* 使用者可以收藏書籍
* 使用者可以查看最新上架的 10 筆書籍
* 使用者可以查看最新的 10 筆評論
* 使用者可以編輯自己的個人資料
* 使用者可以查看自己評論過、收藏過的書籍
* 使用者可以追蹤其他的使用者
* 使用者可以查看自己追蹤中的使用者與正在追蹤自己的使用者
### 後台
* 只有網站管理者可以登入網站後台
* 網站管理者可以在後台管理書籍的基本資料
* 網站管理者可以在後台管理書籍分類
* 網站管理者可以在後台管理使用者的權限

## 環境建置
* [Node.js](https://nodejs.org/en/) @14.16.0
* [Express](https://expressjs.com/) @4.18.1
* [Express Handlebars](https://www.npmjs.com/package/express-handlebars) @4.0.6
* [express-session](https://www.npmjs.com/package/express-session#resave) @1.17.3
* [bcryptjs](https://www.npmjs.com/package/bcrypt) @2.4.3
* [dotenv](https://www.npmjs.com/package/dotenv) @16.0.2
* [method-override](https://www.npmjs.com/package/method-override) @3.0.0
* [passport](https://www.npmjs.com/package/passport) @0.4.1
* [passport-local](http://www.passportjs.org/packages/passport-local/) @1.0.0
* [passport-jwt](https://www.npmjs.com/package/passport-jwt) @4.0.0
* [connect-flash](https://www.npmjs.com/package/connect-flash) @0.1.1
* [dayjs](https://www.npmjs.com/package/dayjs) @1.11.5
* [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker) @7.5.0
* [imgur](https://www.npmjs.com/package/imgur) @1.0.2
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) @8.5.1
* [multer](https://www.npmjs.com/package/multer) @1.4.3
* [mysql2](https://www.npmjs.com/package/mysql2) @2.2.5
* [sequelize](https://www.npmjs.com/package/sequelize) @6.3.5
* [sequelize/cli](https://www.npmjs.com/package/sequelize-cli) @6.2.0


## 專案安裝
### Clone
```
git clone https://github.com/AC-Galen/books-sequelize.git
cd books-sequelize
npm install
```

### 環境變數設定
```
.env.example 移除.example副檔名
修改 IMGUR_CLIENT_ID，JWT_SECRET
```

### 執行專案
```
npm run dev
```
若成功開啟伺服器你會看到：
```
App is running on http://localhost:3000
```
可以至 http://localhost:3000 查看網站

### 種子帳號的資訊如下
```
{
  "name": "root",
  "email": "root@example.com",
  "password": "12345678"
}
{
  "name": "user1",
  "email": "user1@example.com",
  "password": "12345678"
}
{
  "name": "user2",
  "email": "user2@example.com",
  "password": "12345678"
}
```

### 專案已部屬至heroku，但到2022年11月28日便會被消除
```
https://salty-castle-71166.herokuapp.com/signin
```