import React, { useEffect, useRef, useState } from "react";
import GithubAPI, { GithubReposResponse } from "./api/GitubAPI";
import "./App.css";
import GithubCard from "./component/GithubCard";
import InfiniteScroll from "./component/InfiniteScroll";

export default function App() {
  const [searchText, setSearchText] = useState<string>("flippy");
  const [pageLimit, setPageLimit] = useState<{ perPage: number; page: number }>(
    { perPage: 30, page: 1 }
  );
  const [pageQueue, setPageQueue] = useState<number[]>([]);
  const [alreadyFetchPage, setAlreadyFetchPage] = useState<Set<number>>(
    new Set([1])
  );
  const [githubRepos, setGithubRepos] = useState<GithubReposResponse>({
    incompleteResults: false,
    totalCount: 0,
    items: [],
  });
  const [hasError, setHasError] = useState<boolean>(false);

  const timer = useRef<ReturnType<typeof setTimeout>>();

  const onUpdateFetchConfig = (index?: number) => {
    if (index && !alreadyFetchPage.has(index)) {
      setPageQueue([...pageQueue, index]);
      setAlreadyFetchPage((prevState) => {
        const set = new Set(prevState);
        set.add(index);
        return set;
      });
    }
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
            window.alert("noooooooo, rate limit!!!");
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
        onChange={(e) => {
          setSearchText(e.target.value);
          setPageLimit({
            page: 1,
            perPage: 30,
          });
        }}
      />
      <InfiniteScroll
        list={githubRepos.items}
        renderItem={(item) => <GithubCard cardData={item} />}
        keyExtractor={({ id }) => id}
        itemHeight={266}
        renderCount={30}
        apiSignalIndex={6}
        hasNewData={pageLimit.page === 1}
        onFetchApiSignal={onUpdateFetchConfig}
      />
    </div>
  );
}
