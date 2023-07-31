import { useEffect, useRef, useState } from "react";
// import "./App.css";

interface Item {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
}
function App() {
  const [data, setData] = useState<Item[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const abortController = useRef<AbortController>();
  const COUNT = 500

  function fetchItem() {
    abortController.current = new AbortController();
    const signal = abortController.current.signal;
    // http://localhost:3011/items
    fetch(`https://jsonplaceholder.typicode.com/comments?_page=${pageRef.current}`, { signal })
      .then((resp) => resp.json())
      .then((json) => setData((prev: Item[]) => [...prev, ...json]))
      .catch(console.error);
  }

  function partialPull(ev: any) {  
    const element = ref.current;
    if (element !== null) {
      if (data.length === COUNT) {
        element.removeEventListener("scroll", partialPull)
      }
      const maxScroll = element?.scrollHeight - element?.clientHeight;
      const percent = (element?.scrollTop * 100) / maxScroll;
      if (percent === 100) {
        pageRef.current = pageRef.current + 1;
        fetchItem();
        // console.log(`scrollTop:`, percent, "page", pageRef.current);
      }
    }
  }
  useEffect(() => {
    fetchItem();
    const element = ref.current;
    element?.addEventListener("scroll", partialPull);

    return () => {
      element?.removeEventListener("scroll", partialPull);
      setData([]);
      abortController.current?.abort();
    };
  }, []);
  
  return (
    <div>
      <div
        ref={ref}
        id="App"
        style={{
          maxHeight: 210,
          width: "fit-content",
          overflow: "auto",
          background: "yellow",
        }}
      >
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              {item?.id} {item.email}
            </li>
          ))}
        </ul>
      </div>
      <p data-testid="count">count: {data?.length}</p>
    </div>
  );
}

export default App;
