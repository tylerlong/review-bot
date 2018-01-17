# review-bot

Glip bot to monitor app reviews.

Both iOS App Store and Google Play store are supported.

## Setup

```
yarn install
cp .env.sample .env
edit .env

Save your [Appfollow](https://appfollow.io/) service account credentials into `src/review/android/appfollow.json`.
```

## Run

```
yarn start
```

## Usage

### Reviews

#### Add an app to review monitoring list

```
review ios/android add <app_id>
```

#### Remove an iOS app from review monitoring list

```
review ios/android remove <app_id>
```

#### List all the review-monitored apps for iOS/Android

```
review ios/android list
```

#### List all the reviews for an iOS/Android app

```
review ios/android <app_id> reviews
```

#### Show an iOS/Android review

```
review ios/android <app_id> review <index>
```

### Releases

## Todo

* Write tests!
* catch exceptions, such as index out of array.
