# Youtube Latest Videos API

> Backend API for fetching the latest videos for a predefined search query and save them in database.

> Has flexible search option for finding videos saved in database.

> Automated use of next API_KEY from database if current quota exhausted.

> Key storage format in database -

{

  _id: 'jdurn73388',

  keyNumber: 1,

  apiKey: 'jdjfkbdhdk',

  used: 35,

}


## Install Dependencies

```
npm install
```

## Run App

```
Open vars.env and enter your credentials...(MONGO_URI, API_KEY)
```

```
nodemon app
```

## APIs

> Get all videos in paginated response - localhost:3000/api/getAllVideos?page=1

> Get search results in a paginated response - localhost:3000/api/search?page=1&searchQuery=football

> For navigating to next page, change the 'page' value in url.

> To search saved videos, change the 'searchQuery' value in url.

-License: ISC
