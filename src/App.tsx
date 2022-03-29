import React, { useEffect, useRef, useState } from "react";
import GithubAPI, { GithubReposResponse } from "./api/GitubAPI";
import "./App.css";
import GithubCard from "./component/GithubCard";
import InfiniteScroll from "./component/InfiniteScroll";

const renderCount = 30;
const renderHeight = 266;

export default function App() {
  const [hasError, setHasError] = useState<boolean>(false);
  const [pageQueue, setPageQueue] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>("flippy");
  const [pageLimit, setPageLimit] = useState<{ perPage: number; page: number }>(
    { perPage: 30, page: 1 }
  );
  const [alreadyFetchPage, setAlreadyFetchPage] = useState<Set<number>>(
    new Set([1])
  );
  const [githubRepos, setGithubRepos] = useState<GithubReposResponse>({
    incompleteResults: false,
    totalCount: 0,
    items: [],
  });

  const timer = useRef<ReturnType<typeof setTimeout>>();

  const onUpdateFetchConfig = (index?: number) => {
    if (index && githubRepos.totalCount <= renderCount * index) {
      return;
    }

    if (index && !alreadyFetchPage.has(index)) {
      setPageQueue([...pageQueue, index]);
      setAlreadyFetchPage((prevState) => {
        const set = new Set(prevState);
        set.add(index);
        return set;
      });
    }
  };

  const onChangeSearchAndReset = (text: string) => {
    setSearchText(text);
    setPageLimit({
      page: 1,
      perPage: 30,
    });
    setPageQueue([]);
    setAlreadyFetchPage(new Set([1]));
  };

  useEffect(() => {
    if (pageQueue.length > 0) {
      const queue = [...pageQueue];
      const frontPage = queue.shift();
      if (frontPage) {
        setPageQueue(queue);
        setPageLimit((prevState) => ({ ...prevState, page: frontPage }));
      }
    }
  }, [pageQueue]);

  useEffect(() => {
    try {
      if (searchText && !hasError) {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(async () => {
          const requestParams = {
            q: searchText,
            per_page: pageLimit.perPage,
            page: pageLimit.page,
          };
          const response = await GithubAPI.fetchGithubRepos(requestParams);
          if (response?.items) {
            setGithubRepos((prevState) =>
              pageLimit.page === 1
                ? response
                : {
                    ...prevState,
                    ...response,
                    items: [...prevState.items, ...response.items],
                  }
            );
          } else {
            setHasError(true);
            window.alert(
              "noooooooo, rate limit!!! Please check api or manually reload"
            );
          }
        }, 400);
      }
    } catch (error) {
      window.alert(error);
    }
  }, [searchText, pageLimit, hasError]);

  return (
    <div className="app-wrapper">
      <input
        className="search-input"
        type="text"
        placeholder="搜尋 repos..."
        value={searchText}
        onChange={(e) => onChangeSearchAndReset(e.target.value)}
      />
      <InfiniteScroll
        list={githubRepos.items}
        renderItem={(item) => <GithubCard cardData={item} />}
        keyExtractor={({ infiniteScrollId }) => infiniteScrollId}
        itemHeight={renderHeight}
        renderCount={renderCount}
        apiSignalIndex={5}
        hasNewData={pageLimit.page === 1}
        onFetchApiSignal={onUpdateFetchConfig}
      />
    </div>
  );
}
