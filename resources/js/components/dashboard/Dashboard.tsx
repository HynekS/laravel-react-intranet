import { useState, useEffect } from "react"
import { useDebouncedValue } from "../../hooks/useDebouncedValue"
import { Link } from "react-router-dom"

import client from "../../utils/axiosWithDefaults"

// Todo move DetailPage out of project (it is a layout stuff)
import DetailPage from "../project/DetailPage"

import type { akce as Akce, updates as Update } from "@/types/model"

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchResults, setSearchResults] = useState<Akce[]>([])
  const [updateList, setUpdateList] = useState<Update[]>([])

  const debouncedValue = useDebouncedValue(searchTerm, 500)

  useEffect(() => {
    if (searchTerm.length > 2) {
      sendSearchTerm(debouncedValue)
    }

    async function sendSearchTerm(term: string = "") {
      try {
        const response = await client.post<Akce[]>(`/akce/search`, { search_term: term })
        if (response) {
          setSearchResults(response.data)
        }
      } catch (e) {}
    }
  }, [debouncedValue])

  useEffect(() => {
    if (!searchTerm.length) setSearchResults([])
  }, [searchTerm])

  useEffect(() => {
    getUpdates()

    async function getUpdates() {
      try {
        const response = await client.get(`/updates/last_month`)
        if (response) {
          setUpdateList(response.data)
        }
      } catch (e) {}
    }
  }, [])

  return (
    <DetailPage>
      <div tw="p-4 bg-white rounded-lg lg:(p-8)">
        <h1 tw="text-xl">Dashboard</h1>
        <section tw="pb-8">
          <form action="">
            <label htmlFor="quicksearch" tw="block mb-2 text-sm font-bold text-gray-700">
              rychlé hledání
            </label>
            <input
              onChange={e => setSearchTerm(e.target.value)}
              type="text"
              name="quicksearch"
              tw="w-full px-3 py-2 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:outline-none focus:ring focus:transition-shadow focus:duration-300"
            />
          </form>
        </section>
        <section tw="pb-8">
          <h2 tw="text-lg">Statistiky</h2>
          <button
            type="button"
            onClick={() =>
              client("/updates/latest_id").then(res => {
                console.log(res)
              })
            }
          >
            Test update state
          </button>
          <button
            type="button"
            onClick={() =>
              client("/updates/last_month").then(res => {
                console.log(res)
              })
            }
          >
            Get Last Month
          </button>
        </section>
        <section>
          {searchResults.length ? (
            <ul tw="text-xs">
              {searchResults.map(
                (
                  {
                    id_akce,
                    cislo_per_year,
                    rok_per_year,
                    nazev_akce,
                    kraj,
                    okres,
                    katastr,
                    id_stav,
                  } = {} as Akce,
                ) => (
                  <li key={id_akce}>
                    <Link tw="flex gap-2 border-b" to={`/akce/${rok_per_year}/${cislo_per_year}`}>
                      <div tw="w-24 p-2 tabular-nums">
                        {String(cislo_per_year).padStart(3, " ")}/{rok_per_year}
                      </div>
                      <div tw="p-2 w-96 overflow-ellipsis">{nazev_akce}</div>
                      <div tw="w-32 p-2">{kraj}</div>
                      <div tw="w-32 p-2">{okres}</div>
                      <div tw="w-32 p-2">{katastr}</div>
                      <div tw="w-32 p-2">{id_stav}</div>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          ) : null}
        </section>
        <section>
          {updateList.length ? (
            <ul tw="text-xs">
              {updateList.map(result => (
                <li>
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </DetailPage>
  )
}

export default Dashboard
