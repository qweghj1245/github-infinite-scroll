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
  keyExtractor: (item: T) => number;
  itemHeight: number;
};

export default function InfiniteScroll<T>(props: Props<T>) {
  const { list, renderItem, itemHeight, renderCount, keyExtractor } = props;

  const [scrollTop, setScrollTop] = useState<number>(0);
  const [allList, setAllList] = useState<(T & InfiniteScrollComputeType)[]>([]);
  const [renderList, setRenderList] = useState<
    (T & InfiniteScrollComputeType)[]
  >([]);

  const scrollListRef = useRef<HTMLDivElement | null>(null);

  const renderListHeightChange = (item: T & InfiniteScrollComputeType) => {
    const id = item.infiniteScrollId;
    if (
      !item.hasRenderBefore &&
      scrollListRef?.current &&
      (scrollListRef.current!.childNodes as NodeListOf<HTMLDivElement>)[id]
    ) {
      const all = allList;
      const offsetHeight = (
        scrollListRef.current!.childNodes as NodeListOf<HTMLDivElement>
      )[id].offsetHeight;
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
      if (allList[i].itemHeight + allList[i].itemOffsetTop > scrollTop) {
        const renderListStash = allList.slice(
          i,
          Math.min(i + renderCount, allList.length)
        );
        setRenderList(renderListStash);
        renderListStash.forEach((i) => {
          renderListHeightChange(i);
        });
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
    if (list.length > 0) {
      const allListStash = list.map((item, index) => ({
        ...item,
        infiniteScrollId: index,
        hasRenderBefore: false,
        renderListKey: Date.now(),
        itemOffsetTop: index * itemHeight,
        itemHeight,
      }));
      const renderListStash = allListStash.slice(0, renderCount);
      setRenderList(renderListStash);
      setAllList(allListStash);

      renderListStash.forEach((i) => {
        renderListHeightChange(i);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, itemHeight, renderCount]);

  return (
    <div className="scroll-container" onScroll={onScroll}>
      <div className="scroll-tranform">
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
    </div>
  );
}
