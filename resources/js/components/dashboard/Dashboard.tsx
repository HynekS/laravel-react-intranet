import { useState, useEffect, lazy, Suspense } from "react"
import { useDebouncedValue } from "../../hooks/useDebouncedValue"
import { Link } from "react-router-dom"
import { XIcon, SearchIcon } from "@heroicons/react/solid"

import client from "../../utils/axiosWithDefaults"

// Todo move DetailPage out of project (it is a layout stuff)
import DetailPage from "../project/DetailPage"

import type { akce as Akce, updates as Update, users as User } from "@/types/model"

const DistrictsMap = lazy(() => import("./Districts"))

type UpdateListItem = {
  akce: {
    id_akce: number
    cislo_per_year: number
    rok_per_year: number
    nazev_akce: string
  } | null
  akce_id: number
  id: number
  updates: Array<Update & { user: Pick<User, "id" | "full_name"> }>
}

const SearchResults = ({ results }: { results: null | Akce[] }) => {
  if (results === null) {
    return null
  }
  if (!results.length) {
    return (
      <section tw="relative">
        <div tw="absolute top-0 left-0 right-0 p-4 text-xs bg-white border rounded shadow">
          Nic nenalezeno. Zkuste upravit hledaný výraz.
        </div>
      </section>
    )
  }
  return (
    <section tw="relative">
      <ul tw="absolute top-0 left-0 right-0 py-4 text-xs bg-white border rounded shadow">
        {results.map(
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
              nalez,
            } = {} as Akce,
          ) => (
            <li key={id_akce} tw="not-last:(border-b)">
              <Link tw="flex" to={`/akce/${rok_per_year}/${cislo_per_year}`}>
                <div tw="w-24 p-4 tabular-nums">
                  {String(cislo_per_year).padStart(3, " ")}/{rok_per_year}
                </div>
                <div tw="p-4 truncate w-96">{nazev_akce}</div>
                <div tw="w-32 p-4">{kraj}</div>
                <div tw="w-32 p-4">{okres}</div>
                <div tw="w-32 p-4">{katastr}</div>
                <div tw="w-20 p-4 text-right">{id_stav}</div>
                <div tw="w-24 p-4 text-right">{nalez}</div>
              </Link>
            </li>
          ),
        )}
      </ul>
    </section>
  )
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchResults, setSearchResults] = useState<Akce[] | null>(null)
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
      } catch (e) {
        // TODO: send a toast
      }
    }
  }, [debouncedValue])

  useEffect(() => {
    if (!searchTerm.length) setSearchResults(null)
  }, [searchTerm])

  useEffect(() => {
    getUpdates()

    async function getUpdates() {
      try {
        const response = await client.get(`/updates/last_month`)
        if (response) {
          setUpdateList(response.data)
        }
      } catch (e) {
        // TODO: send a toast
      }
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
                <div tw="relative">
                  <input
                    onChange={e => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    type="text"
                    name="quicksearch"
                    id="quicksearch"
                    tw="w-full px-3 py-2 pl-12 leading-tight text-gray-600 border rounded appearance-none bg-gray-50 focus:outline-none focus:ring focus:transition-shadow focus:duration-300"
                  />
                  <SearchIcon tw="absolute top-0 bottom-0 pr-2 my-auto border-r w-7 h-7 left-3 fill-gray-400 border-r-gray-200" />
                  {searchResults?.length ? (
                    <XIcon
                      tw="absolute top-0 bottom-0 w-5 h-5 my-auto cursor-pointer right-3"
                      onClick={() => {
                        setSearchTerm("")
                        setSearchResults([])
                      }}
                    />
                  ) : null}
                </div>
              </form>
            </section>
            <SearchResults results={searchResults} />
            <Suspense fallback={<div>Loading…</div>}>
              <section tw="flex items-center justify-center p-8">
                <DistrictsMap fill="#e5e7eb" />
              </section>
            </Suspense>
          </div>
          <section tw="md:(w-2/5)">
            <h2 tw="mb-2 text-sm font-bold text-gray-700">poslední aktualizace</h2>
            {updateList.length ? (
              <ul tw="text-xs">
                {updateList.map(project => (
                  <li tw="py-2" key={project.id}>
                    <h3 tw="pb-1 text-xs font-semibold">
                      {project.akce ? (
                        <Link
                          to={`/akce/${project.akce.rok_per_year}/${project.akce.cislo_per_year}`}
                          tw="flex gap-2 hover:(text-lightblue-500 underline)"
                        >
                          <span tw="block">
                            {`${project.akce.cislo_per_year}/${String(
                              project.akce.rok_per_year,
                            ).slice(2)}`}
                          </span>
                          <span tw="flex-1 block hover:after:(content[' →'])">
                            {project.akce.nazev_akce}
                          </span>
                        </Link>
                      ) : (
                        "(Odstranněná akce)"
                      )}
                    </h3>
                    <ul tw="pb-2 pl-2 text-gray-500">
                      {project.updates.length
                        ? project.updates.map(update => (
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
                              <div tw="flex flex-1">
                                <div
                                  tw="w-4 h-4 mx-2 border border-gray-200 rounded-full bg-lightblue-200"
                                  style={{
                                    backgroundImage: `url(/storage/${update.user.avatar_path})`,
                                  }}
                                ></div>
                                <div>
                                  {update.user.full_name} aktualizoval(a) {update.update_scope}
                                </div>
                              </div>
                            </li>
                          ))
                        : null}
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
