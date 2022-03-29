# Github Infinite Scroll

[DEMO](https://github-infinite-scroll.vercel.app/)

# 執行方式

yarn start

# Feature

1. 實作 Infinite Scroll
2. 可以根據輸入框的變動改變列表
3. 處理錯誤狀態

# 資料夾結構

- src
  - api
  - component
  - utils

# 架構設計

為求快速就用 CRA 開一個新專案，因為沒有太多 page 所以直接寫在 App，但因為需求的關係所以在切幾個 folder 出來增加可讀性，沒有使用任何的 package。
因為平常使用 React + TypeScript 所以就沿用習慣，這次主要開發重點是 Infinite Scroll，所以立馬想起 [google 曾提及的問題](https://developer.chrome.com/blog/infinite-scroller/) 和這張圖

![](https://i.imgur.com/0gxvZQN.png)

我實作的 component 主要處理 dom 渲染過多的問題，那程式設計的方向有幾個

- 如何做出 window 的效果？
- 怎麼維持固定數量的 dom ?
- 向下捲的時候 dom 怎麼被更新？
- 預渲染的處理 （這個最後講，剛開始不會碰到）

### 如何做出 window 的效果？

以圖來看可以三個區塊，整個列表、顯示部份、預渲染部分，雖然是這樣但我覺得可以先處理前兩個。
window 的部分其實很間單，就是用 overflow + translate3d 實現的，有實作過輪播就知道其實概念差不多，在這邊就是垂直位移。

### 怎麼維持固定數量的 dom ?

用 props renderCount 去控制

### 向下捲的時候 dom 怎麼被更新？

我參考過蠻多網站的做法，有些做法會是上下多預渲染一些，某個時間點更新 dom。
以 Dcard 來說會控制某個 dom 數量，然後採先進先出的方式更新 dom，看起來是最有效率的方式，所以就先往這個方向做。
其中實作最重要的部分都在 onScroll 裡面，裡面做了兩件事

1. 捲動時同時更新 translate3d 造成位移
2. 捲動時同時更新 dom 的資料

這樣就可以很簡單的處理，唯一美中不足的地方是 getRenderList，我在裡面拋出一個 call api 的訊號，
會這樣做是因為我覺得資料重新獲取這件事在實務上可以被討論的，甚至可以被量化一個時間點，
但因為我只有自己做這個，所以就給一個 props apiSignalIndex 去計算 call 訊號時機，算比較隨性。

### 預渲染的處理

我一開始是沒做這塊的，但發現往上捲會有留白機會，推測是資料沒跑完但位移先跑完所以會有的暫時現象，所以在 76 行多做 itemHeight \* 2 預留兩格空間。
