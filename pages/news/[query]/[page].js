import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export async function getServerSideProps(context) {
  const { query, page } = context.params;
  return {
    props: {
      query,
      page,
    },
  };
}

const NewsResults = ({ query, page }) => {
  const [value, setValue] = useState(query);
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const router = useRouter();

  const getData = async () => {
    const res = await fetch(
      `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI?q=${query}&pageNumber=${page}&pageSize=10&autoCorrect=true&withThumbnails=true&fromPublishedDate=null&toPublishedDate=null`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_API_KEY,
          "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
        },
      }
    );
    const data = await res.json();
    setData(data);
  };

  const handleEnterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      router.push(`/news/${value}/1`);
    }
  };

  useEffect(() => {
    getData();
  }, [page, query]);

  useEffect(() => {
    if (data.length !== 0) {
      let gettotalPage = parseInt(data.totalCount / 10);
      const reminder = data.totalCount % 10;
      if (reminder !== 0) {
        gettotalPage += 1;
      }
      setTotalPage(gettotalPage);
    }
  }, [data]);

  return (
    <div className="w-full md:grid grid-cols-4">
      <aside className="w-full col-auto flex flex-col items-center h-full border-r">
        <Link href="/">
          <h1 className="w-full text-4xl font-bold cursor-pointer text-gray-700 mt-10 text-center">
            <span className="text-red-500">Our</span>Search
          </h1>
        </Link>
        <h3 className="hidden text-lg mt-16 pt-5 md:inline-flex">
          Related Search:
        </h3>
        <ul className="hidden md:flex flex-col mt-8 items-center gap-2 px-3">
          {data.relatedSearch &&
            data.relatedSearch.map((item, index) => (
              <Link
                href={`/news/${item.replace(/<[^>]*>?/gm, "")}`}
                key={index}
              >
                <li
                  dangerouslySetInnerHTML={{ __html: item }}
                  className="text-blue-700 hover:underline cursor-pointer text-center text-sm"
                ></li>
              </Link>
            ))}
        </ul>
      </aside>
      <main className="w-full col-span-3 flex flex-col items-center">
        <div className="w-full mt-10 flex justify-center">
          <input
            type="text"
            className="w-4/6 border border-gray-900 py-2 px-3 focus:outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={(e) => handleEnterKeyPressed(e)}
          />
          <Link href={`/news/${value}/1`}>
            <button className="py-2 px-6 bg-gray-900 text-white font-semibold focus:outline-none">
              Search
            </button>
          </Link>
        </div>
        <ul className="w-full flex mt-16 border-b">
          <Link href={`/search/${query}/1`}>
            <li className="py-3 px-4 cursor-pointer">All</li>
          </Link>
          <Link href={`/news/${query}/${page}`}>
            <li className="py-3 px-4 border-t border-r border-l font-semibold cursor-pointer">
              News
            </li>
          </Link>
          <Link href={`/imgs/${query}/1`}>
            <li className="py-3 px-4 cursor-pointer">Images</li>
          </Link>
        </ul>
        <div className="flex flex-col gap-7 m-7">
          {data.value &&
            data.value.map((item, index) => (
              <div
                key={index}
                className="w-full py-4 border px-3 flex gap-2 rounded-md border-gray-300"
              >
                <div>
                  <Link href={item.url}>
                    <h2 className="text-blue-700 hover:underline cursor-pointer text-xl mt-2">
                      {item.title}
                    </h2>
                  </Link>
                  <p
                    dangerouslySetInnerHTML={{ __html: item.snippet + ".." }}
                    className="mt-4"
                  ></p>
                </div>
                <img
                  className="hidden md:block"
                  src={item.image.thumbnail}
                  width={item.image.thumbnailWidth}
                  height={item.image.thumbnailHeight}
                />
              </div>
            ))}
        </div>
        {data.value && (
          <ul className="flex justify-center gap-5 p-16 w-full">
            {parseInt(page) !== 1 && (
              <Link href={`/news/${query}/${parseInt(page) - 1}`}>
                <li className="py-2 px-6 border hover:text-blue-500 cursor-pointer border-gray-500 rounded-sm hover:bg-gray-100">
                  Prev Page
                </li>
              </Link>
            )}
            <p className="flex items-center py-2 px-4 border focus:outline-none">
              Page {page} of {totalPage}
            </p>
            {parseInt(page) !== totalPage && (
              <Link href={`/news/${query}/${parseInt(page) + 1}`}>
                <li className="py-2 px-6 border hover:text-blue-500 cursor-pointer border-gray-500 rounded-sm hover:bg-gray-100">
                  Next Page
                </li>
              </Link>
            )}
          </ul>
        )}
      </main>
    </div>
  );
};

export default NewsResults;
