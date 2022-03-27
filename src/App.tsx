import React from "react";
import InfiniteScroll from "./component/InfiniteScroll";

function App() {
  return (
    <div className="app-wrapper">
      <InfiniteScroll
        list={Array.from(Array(1000).keys()).map((item) => ({ id: item }))}
        renderItem={(item) => <div>{item.id}</div>}
        keyExtractor={({ id }) => id}
        itemHeight={19}
        renderCount={30}
      />
    </div>
  );
}

export default App;
