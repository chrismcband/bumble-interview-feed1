import React, { useCallback, useEffect, useState, useRef } from "react";
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

      intervalId.current = window.setInterval(handlePoll, POLL_INTERVAL);
    });
  }, [handlePoll, setNewData]);

  useEffect(() => {
    // Clean up interval on unmount
    return () => window.clearInterval(intervalId.current);
  }, []);

  return (
    <div className="App">
      <Title text="Latest tweets" />
      <TweetWrapper list={tweets} />
    </div>
  );
};
