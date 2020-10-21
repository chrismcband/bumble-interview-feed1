import React from "react";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import "./styles.css";

import { Tweet } from "../Tweet";

export const TweetWrapper = ({
  list = [],
  onScroll,
  loaderRef,
  onItemsRendered
}) => (
  <AutoSizer>
    {({ height, width }) => (
      <FixedSizeList
        height={height}
        itemCount={list.length}
        itemSize={200}
        width={width}
        itemData={list}
        onScroll={onScroll}
        onItemsRendered={onItemsRendered}
        ref={loaderRef}
      >
        {Tweet}
      </FixedSizeList>
    )}
  </AutoSizer>
);
