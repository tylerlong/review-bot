# review-bot

Glip bot to monitor app reviews.

Both iOS App Store and Google Play store are supported.


## Setup

```
yarn install
cp .env.sample .env
edit .env

Save your Google service account credentials into `src/android/key.json`.
```


## Run

```
yarn start
```


## Todo

- Write tests!
- catch exceptions, such as index out of array.
- save all the reviews in db, because API only shows reviews for the recent week
