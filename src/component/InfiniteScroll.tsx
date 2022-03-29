import React, { useEffect, useRef, useState } from "react";
import "./InfiniteScroll.css";

interface InfiniteScrollComputeType {
  infiniteScrollId: number;
  hasRenderBefore: boolean;
  renderListKey: number;
  itemOffsetTop: number;
  itemHeight: number;
}

type Props<T> = {
  list: T[];
  renderItem: (item: T) => JSX.Element;
  renderCount: number;
  keyExtractor: (item: T & InfiniteScrollComputeType) => number;
  itemHeight: number;
  apiSignalIndex: number;
  onFetchApiSignal: (currentIndex?: number) => void;
  hasNewData: boolean;
};

export default function InfiniteScroll<T>(props: Props<T>) {
  const {
    list,
    renderItem,
    itemHeight,
    renderCount,
    keyExtractor,
    apiSignalIndex,
    hasNewData,
    onFetchApiSignal,
  } = props;

  const [isInitialize, setIsInitialize] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [allList, setAllList] = useState<(T & InfiniteScrollComputeType)[]>([]);
  const [renderList, setRenderList] = useState<
    (T & InfiniteScrollComputeType)[]
  >([]);

  const scrollListRef = useRef<HTMLDivElement | null>(null);

  const renderListHeightChange = (
    item: T & InfiniteScrollComputeType,
    hasNewList?: (T & {
      infiniteScrollId: number;
      hasRenderBefore: boolean;
      renderListKey: number;
      itemOffsetTop: number;
      itemHeight: number;
    })[]
  ) => {
    const id = item.infiniteScrollId;
    const scrollListRefChild = (
      scrollListRef.current!.childNodes as NodeListOf<HTMLDivElement>
    )[id];
    if (!item.hasRenderBefore && scrollListRef?.current && scrollListRefChild) {
      const all = hasNewList ?? allList;
      const offsetHeight = scrollListRefChild.offsetHeight;
      all[id].itemHeight = offsetHeight;
      all[id].hasRenderBefore = true;
      for (let i = 0; i < all.length; i++) {
        if (i > 0) {
          all[i].itemOffsetTop =
            all[i - 1].itemOffsetTop + all[i - 1].itemHeight;
        }
      }
      setAllList(all);
    }
  };

  const getRenderList = () => {
    for (let i = 0; i < allList.length; i++) {
      const offsetItemDistance =
        allList[i].itemHeight + allList[i].itemOffsetTop + itemHeight * 2;

      if (offsetItemDistance > scrollTop) {
        const renderListSlice = allList.slice(
          i,
          Math.min(i + renderCount, allList.length)
        );
        setRenderList(renderListSlice);
        renderListSlice.forEach((item) => {
          renderListHeightChange(item);
        });

        // call api's condition
        if (Math.round(i / apiSignalIndex) > 1) {
          onFetchApiSignal(Math.round(i / apiSignalIndex));
        }
        break;
      }
    }
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (
      Math.abs(e.currentTarget.scrollTop - scrollTop) > itemHeight ||
      e.currentTarget.scrollTop === 0
    ) {
      setScrollTop(e.currentTarget.scrollTop);
      getRenderList();
    }
  };

  useEffect(() => {
    if (list?.length > 0) {
      const map = new Set();
      allList.forEach((item) => {
        map.add(item.infiniteScrollId);
      });
      const filterNewList = hasNewData
        ? list
        : list.filter((item, index) => !map.has(index));
      const allListExtendsConfig = filterNewList.map((item, index) => ({
        ...item,
        infiniteScrollId: allList.length + index,
        hasRenderBefore: false,
        renderListKey: Date.now(),
        itemOffsetTop: (allList.length + index) * itemHeight,
        itemHeight,
      }));
      setAllList(
        hasNewData
          ? allListExtendsConfig
          : [...allList, ...allListExtendsConfig]
      );

      if (!isInitialize || hasNewData) {
        const renderListExtendsConfig = hasNewData
          ? allListExtendsConfig
          : [...allList, ...allListExtendsConfig].slice(0, renderCount);
        setRenderList(renderListExtendsConfig);
        setIsInitialize(true);
        renderListExtendsConfig.forEach((i) => {
          renderListHeightChange(
            i,
            hasNewData ? allListExtendsConfig : undefined
          );
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, itemHeight, renderCount, hasNewData]);

  return (
    <div className="scroll-container" onScroll={onScroll}>
      <div
        className="scroll-list"
        ref={scrollListRef}
        style={{
          transform:
            "translate3d(0," +
            (renderList[0] ? renderList[0].itemOffsetTop : 0) +
            "px,0)",
        }}
      >
        {renderList.map((item) => (
          <div
            className="scroll-item"
            key={keyExtractor(item)}
            data-key={keyExtractor(item)}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
