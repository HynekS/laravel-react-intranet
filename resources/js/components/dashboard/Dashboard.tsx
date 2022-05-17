import { useState, useEffect } from "react"
import { useDebouncedValue } from "../../hooks/useDebouncedValue"
import { Link } from "react-router-dom"

import client from "../../utils/axiosWithDefaults"

// Todo move DetailPage out of project (it is a layout stuff)
import DetailPage from "../project/DetailPage"

import type { akce as Akce, updates as Update, users as User } from "@/types/model"

type UpdateListItem = {
  akce: {
    id_akce: number
    cislo_per_year: number
    rok_per_year: number
    nazev_akce: string
  }
  akce_id: number
  id: number
  updates: Array<Update & { user: Pick<User, "id" | "full_name"> }>
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchResults, setSearchResults] = useState<Akce[]>([])
  const [updateList, setUpdateList] = useState<UpdateListItem[]>([])

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
        <h1 tw="text-xl">Přehled</h1>
        <div tw="flex flex-col md:(flex-row gap-x-12)">
          <div tw="pb-8 flex-1 md:(w-3/5)">
            <section>
              <form action="" tw="w-full">
                <h2 tw="mb-2 text-sm font-bold text-gray-700">
                  <label htmlFor="quicksearch">rychlé hledání</label>
                </h2>
                <input
                  onChange={e => setSearchTerm(e.target.value)}
                  type="text"
                  name="quicksearch"
                  id="quicksearch"
                  tw="w-full px-3 py-2 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:outline-none focus:ring focus:transition-shadow focus:duration-300"
                />
              </form>
            </section>
            {/*<section tw="pb-8">
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
            </section>*/}
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
                        <Link
                          tw="flex gap-2 border-b"
                          to={`/akce/${rok_per_year}/${cislo_per_year}`}
                        >
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
          </div>
          <section tw="md:(w-2/5)">
            <h2 tw="mb-2 text-sm font-bold text-gray-700">poslední aktualizace</h2>
            {updateList.length ? (
              <ul tw="text-xs">
                {updateList.map(project => (
                  <li tw="py-2" key={project.id}>
                    <h3 tw="pb-1 text-xs font-semibold">
                      <Link
                        to={`/akce/${project.akce.rok_per_year}/${project.akce.cislo_per_year}`}
                        tw="flex gap-2"
                      >
                        <span tw="block">
                          {`${project.akce.cislo_per_year}/${String(
                            project.akce.rok_per_year,
                          ).slice(2)}`}
                        </span>
                        <span tw="flex-1 block">{project.akce.nazev_akce}</span>
                      </Link>
                    </h3>
                    <ul tw="pb-2 pl-2 text-gray-500">
                      {project.updates.map(update => (
                        <li tw="flex justify-between gap-2 px-2 pt-2 border-l" key={update.id}>
                          <div tw="min-width[9ch] text-right tabular-nums font-semibold text-gray-400">
                            {new Date(update.created_at)
                              .toLocaleDateString(undefined, {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                              })
                              .toString()
                              .replace(/0(?=\d\.)/g, " ")}
                          </div>
                          <div tw="flex-1">
                            {update.user.full_name} aktualizoval(a) {update.update_scope}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </div>
      </div>
    </DetailPage>
  )
}

export default Dashboard
