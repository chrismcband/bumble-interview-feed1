# Tech test

## New requirements

- When not at the top stop polling, resume when back at the top
- When at the bottom fetch past tweets


## Decisions made

Here is a brief overview of some of the things I thought about when doing this test.

### AfterId endpoint

The reason I used after ID is that I was concerned that there may be scenarios in which you could miss tweets if using timestamps. If you have 3 tweets that all happen on the same timestamp and you are polling based on your latest local tweets timestamp, then if you got 2 tweets and requested another 2 that happened after that timestamp you would miss the 3rd tweet.

### react-window

As performance and stability were important aspects of this code test I decided to use a virtualisation library to handle what was currently being rendered in the client. This allows a much better user experience and ensures the performance doesn't degrade as the amount of data increases. Although there isn't enough data to cause issue in this test you could trim the end of data as you fetch new data to prevent too much being held in memory.

### Architecture

Due to the simplicity of the application I have just sorted everything into two categories: utils or components. All of the business logic is currently within App.js but were this to be a large application you could move to a feature based directory structure.

I have also used a config file for ease of customisation of the App.

### Keep retrying API calls

I have used `while` to ensure that an API call is tried until successful. I chose this over a recursive method because with recursion you could hit a stack overflow with enough failed attempts.

### Don't make multiple calls at once

I have set up the app to check whether there is a request in flight before making another one to prevent overloading anyone on a slower connection with multiple requests in flight at the same time.
