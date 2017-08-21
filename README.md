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


## Usage

### Add an app to monitoring list

```
ios/android add <app_id>
```

### Remove an iOS app from monitoring list

```
ios/android remove <app_id>
```

### List all the monitored apps for iOS/Android

```
ios/android list
```

### List all the reviews for an iOS/Android app

```
ios/android <app_id> reviews
```

### Show an iOS/Android review

```
ios/android <app_id> review <index>
```


## Todo

- Write tests!
- catch exceptions, such as index out of array.
