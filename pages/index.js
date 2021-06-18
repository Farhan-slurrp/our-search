import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [value, setValue] = useState("");
  const [wordQueries, setWordQueries] = useState([]);
  const router = useRouter();

  const autoComplete = async () => {
    const res = await fetch(
      `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/spelling/AutoComplete?text=${value}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_API_KEY,
          "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
        },
      }
    );
    const data = await res.json();
    setWordQueries(data);
  };

  const handleEnterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      router.push(`/search/${value}/1`);
    }
  };

  useEffect(() => {
    autoComplete();
  }, [value]);

  return (
    <div className="w-full flex flex-col items-center w-full py-8 md:px-16">
      <h1 className="text-gray-700 mt-16 font-bold text-5xl">
        <span className="text-red-500">Our</span>Search
      </h1>
      <p className="mt-8 text-xl hidden w-full text-center md:block">
        Your privacy our priority. PROMISE😎✌
      </p>
      <div className="w-full mt-16 flex justify-center">
        <input
          type="text"
          className="w-1/2 py-2 px-3 border border-gray-900 focus:outline-none rounded-tl-2xl rounded-bl-2xl"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyUp={(e) => handleEnterKeyPressed(e)}
        />
        <Link href={`/search/${value}/1`}>
          <button className="bg-gray-900 w-1/12 rounded-tr-2xl rounded-br-2xl focus:outline-none text-white font-semibold">
            Search
          </button>
        </Link>
      </div>
      {wordQueries && wordQueries.length != 0 && (
        <ul className="w-6/12 mr-16 mt-2 border border-gray-300">
          {wordQueries &&
            wordQueries.map((word, index) => (
              <Link href={`/search/${word}/1`} key={index}>
                <li className="flex justify-between px-4 py-2 cursor-pointer hover:bg-gray-200">
                  {word}
                </li>
              </Link>
            ))}
        </ul>
      )}
    </div>
  );
}
