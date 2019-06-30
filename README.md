# Mercury
Mercury is the god of trade, commerce, messages/communication, travelers and boundaries.
This forum is a source for what's new and popular on the web.
Users provide all kinds of content, and decide, through voting, what's good and what's junk. Messages and news can be spread faster through this forum. Different contents are stored in different Subs allowing users can find the news they are interested in immediately.

## Demo
Online Demo: 
Video: 

## Installation
### Production
First clone the repo:  
```
git clone 
cd 
```

Then build the frontend:
```
cd frontend
npm install
``` 

Lastly, build and start the server
```
cd ../backend
npm install
npm start
```
When no port is set in environment variable, port `4000` will be used.

### Development
Run both backend and frontend via concurrently:
```
cd frontend
npm run dev
```
Now use `localhost:3000` to access Mercury.  

## Packages Used
### Frontend
* React
* Bootstrap 4 & Reactstrap
* react-newline-to-break
* formic
* graphql
* jwt-decode
* react-apollo
* react-perfect-scrollbar
* react-router-dom
* yup

### Backend
* bcryptjs
* graphql-yoga
* jsonwebtoken
* mongoose
* MongoDB(for database)

### Code
* auth_rics_chat_app
* modern-graphql-tutorial

## Teammate Contribution
* Backend & Frontend : 蘇邱弘
* Frontend : 陳子晴

## 心得

陳子晴: 

這次的 Project 我沿用了期中想要自己做出一個Reddit網站的想法，後端使用了 HW3 時用的 GraphQL，除了對GraphQL的Model與形式更加熟悉之外，也覺得GraphQL在使用上真的是相對的直觀也方便許多。
分組的合作上，我是第一次使用GitHub與別人協同合作，充分認知到在開始寫code前先訂好需要的架構與功能是一件很重要的事，因為在寫前端時常常會突然想要加哪些功能等等，就需要再去增改後端才能夠支援這樣的前端呈現。此外，在協調合作時，Code乾淨也非常重要，只有乾淨簡潔的code 才不會讓整份 project 裡面出現一些奇怪的 error。撰寫前端的時候，覺得要會刻前端，美感與耐心實在都是非常重要的能力，要如何讓使用者操作起來順手、畫面看得賞心悅目都是一大課題。這次的專題真的有創造出東西的感覺，我也覺得寫Web真的是博大精深的東西，比較可惜的是對於後端的部分碰得比較少，希望未來能夠更加熟悉後端完整的架構。

蘇邱弘: 

這次期末project挑戰了GraphQL，而非期中使用的RESTful+Redux的架構。雖然某些地方很實在地感受到了他的好處，但還是覺得自己的code寫的亂亂雜雜的樣子，尤其是前端的部份，沒有辦法像期中那樣結構及功能都切得很乾淨的感覺，我之後在這方面還是有許多進步空間吧。
