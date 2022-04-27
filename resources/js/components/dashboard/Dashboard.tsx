import client from "../../utils/axiosWithDefaults"

// Todo move DetailPage out of project (it is a layout stuff)
import DetailPage from "../project/DetailPage"

const Dashboard = () => {
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
      </div>
    </DetailPage>
  )
}

export default Dashboard
