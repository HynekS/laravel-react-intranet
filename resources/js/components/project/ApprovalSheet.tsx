import tw from "twin.macro"

import client from "../../utils/axiosWithDefaults"
import DetailWrapper from "./DetailWrapper"
import SvgDocument from "../../vendor/heroicons/outline/Document"

const ApprovalSheet = ({ detail }) => {
  return (
    <DetailWrapper>
      <h1>Expertní list</h1>
      <button
        tw="flex items-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium py-2 px-4 rounded focus:(outline-none ring)"
        type="button"
        onClick={async () => {
          client({
            url: `/report/${detail.id_akce}`,
            method: "POST",
            responseType: "blob",
            data: {
              ...detail,
            },
          }).then(response => {
            console.log("get a response!")
            const url = window.URL.createObjectURL(
              new Blob([response.data], { type: "application/pdf" }),
            )
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", "Examen.pdf")
            link.target = "_blank"
            link.download = `expertni_list_${
              detail
                ? `${detail.c_akce}_${detail.nazev_akce?.split(" ").slice(0, 5).join(" ")}….pdf`
                : `.pdf`
            }`
            link.click()
          })
        }}
      >
        <SvgDocument tw="w-4 mr-1" />
        Stáhnout PDF
      </button>
    </DetailWrapper>
  )
}

export default ApprovalSheet
