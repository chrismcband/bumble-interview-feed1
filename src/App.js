import React, { useCallback, useEffect, useState, useRef } from "react";
import InfiniteLoader from "react-window-infinite-loader";
import "./styles.css";

import { fetchWrapper } from "./utils/fetchWrapper";
import {
  POLL_INTERVAL,
  TWEETS_TO_FETCH,
  INITIAL_TWEETS_TO_FETCH
} from "./utils/config";

import { Title } from "./components/Title";
import { TweetWrapper } from "./components/TweetWrapper";

export default () => {
  const [tweets, setTweets] = useState([]);
  const inProgress = useRef(false);
  const nextId = useRef(null);
  const intervalId = useRef(null);

  const setNewData = useCallback((data = []) => {
    setTweets((prevState = []) => {
      const newData = [...data, ...prevState];
      // Create a set of Ids as this removes all the duplicate ids
      // Then map over the complete data set only returning the tweets you have an id for
      return Array.from(new Set(newData.map((item) => item.id))).map((id) => {
        return newData.find((item) => item.id === id);
      });
    });
  }, []);

  const handlePoll = useCallback(() => {
    // Check whether there is a request in progress before making another
    // we don't want to overload a slow connection with alot of requests
    if (!inProgress.current) {
      inProgress.current = true;
      fetchWrapper({ count: TWEETS_TO_FETCH, afterId: nextId.current }).then(
        (data) => {
          inProgress.current = false;
          if (data.length) {
            nextId.current = data[0].id;
            setNewData(data);
          }
        }
      );
    }
  }, [setNewData]);

  useEffect(() => {
    // On first mount grab some data to show the user, then start polling
    fetchWrapper({ count: INITIAL_TWEETS_TO_FETCH }).then((data) => {
      if (data.length) {
        nextId.current = data[0].id;
        setNewData(data);
      }
    });
  }, [handlePoll, setNewData]);

  const handleScroll = ({ scrollOffset }) => {
    if (scrollOffset > 0) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    } else {
      if (!intervalId.current) {
        intervalId.current = setInterval(handlePoll, POLL_INTERVAL);
      }
    }
  };

  useEffect(() => {
    // Clean up interval on unmount
    return () => clearInterval(intervalId.current);
  }, []);

  const loadNextPage = (props) => {
    console.log("fetch data", props);

    fetchWrapper({
      count: 15,
      beforeId: tweets[tweets.length - 1].id
    }).then((data) => {
      if (data.length) {
        console.log("data", data);
        // setNewData(data);
        setTweets((prevState = []) => {
          const newData = [...prevState, ...data];
          // Create a set of Ids as this removes all the duplicate ids
          // Then map over the complete data set only returning the tweets you have an id for
          return Array.from(new Set(newData.map((item) => item.id))).map(
            (id) => {
              return newData.find((item) => item.id === id);
            }
          );
        });
      }
    });
  };

  const hasNextPage = true;

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? tweets.length + 1 : tweets.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = inProgress.current ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index) => !hasNextPage || index < tweets.length;

  return (
    <div className="App">
      <Title text="Latest tweets" />
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
        threshold={1}
      >
        {({ onItemsRendered, ref }) => (
          <TweetWrapper
            list={tweets}
            onScroll={handleScroll}
            onItemsRendered={onItemsRendered}
            loaderRef={ref}
          />
        )}
      </InfiniteLoader>
    </div>
  );
};
