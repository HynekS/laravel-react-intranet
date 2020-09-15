/** @jsx jsx */
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { jsx } from "@emotion/core"
import tw from "twin.macro"

import DetailWrapper from "./DetailWrapper"
import Input from "../common/Input"
import Checkbox from "../common/Checkbox"
import Radio from "../common/Radio"
import Select from "../common/Select"

import ButtonStyledRadio from "./ButtonStyledRadio"

const Detail = ({ detail }) => {
  const { register, handleSubmit, setValue, watch, errors } = useForm()
  const { c_akce, nazev_akce } = detail || {}

  useEffect(() => {
    if (detail) {
      for (let [key, value] of Object.entries(detail)) {
        setValue(key, value)
        /*
        let current = document.querySelector(`input[name=${key}]`)
        if (current) {
          current.style.width =
            (value?.length || String(value).length || current?.placeholder.length) + 3 + "ch"
        }*/
      }
    }
  }, [detail])

  const onSubmit = () => {
    console.log("fake submit")
  }

  return (
    <DetailWrapper>
      <h2 tw="font-medium text-gray-700 text-xl">
        {c_akce}&ensp;{nazev_akce}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div>
            <div>
              <Input
                name="c_akce"
                label="číslo akce"
                placeholder="číslo akce"
                register={register}
              />
              <Input
                name="nazev_akce"
                label="název akce"
                placeholder="název akce"
                register={register}
              />
            </div>
          </div>
          <div>
            <div>
              <Input
                name="objednavka_cislo"
                label="číslo objednávky"
                placeholder="číslo objednávky"
                register={register}
              />
              <Checkbox name="smlouva" label="smlouva podepsána" register={register} />
              <Input
                name="rozpocet_B"
                label="rozpočet dohledy"
                placeholder="Rozpočet dohledy"
                register={register}
              />
              <Input
                name="rozpocet_A"
                label="rozpočet výzkum"
                placeholder="Rozpočet výzkum"
                register={register}
              />
            </div>
          </div>
          <div>
            <hr />
            <div>
              <Checkbox
                name="registrovano_bit"
                label="registrováno v databázi"
                register={register}
              />
              <Input
                name="registrace_info"
                label="id registrace"
                placeholder="id registrace"
                register={register}
              />
              <Select
                name="id_stav"
                label="stav"
                placeholder="stav"
                options={[
                  { label: "-1 (akce padla)", value: -1 },
                  { label: "1 (před zahájením)", value: 1 },
                  { label: "2 (zahájeno v terénu)", value: 2 },
                  { label: "3 (probíhá zpracování)", value: 3 },
                  { label: "4 (hotovo)", value: 4 },
                ]}
                register={register}
              />
            </div>
          </div>
          <div>
            <hr />
            <div>
              <Input
                name="investor_jmeno"
                label="název investora"
                placeholder="jméno investora"
                register={register}
              />
              <Input
                name="investor_kontakt"
                label="zástupce investora"
                placeholder="zástupce investora"
                register={register}
              />
              <Input
                name="investor_adresa"
                label="sídlo investora"
                placeholder="sídlo investora"
                register={register}
              />
              <Input
                name="investor_ico"
                label="IČO investora"
                placeholder="IČO investora"
                register={register}
              />
            </div>
          </div>
          <div>
            <hr />
            <div>
              <Input name="katastr" label="katastr" placeholder="katastr" register={register} />
              <Input
                type="text"
                name="okres"
                label="okres"
                placeholder="okres"
                register={register}
              />
              <Input type="text" name="kraj" label="kraj" placeholder="kraj" register={register} />
            </div>
            <hr />
          </div>
          <div>
            <div>
              <ButtonStyledRadio
                name="nalez"
                label="nález"
                options={{
                  nezjištěno: null,
                  pozitivní: 1,
                  negativní: 0,
                }}
                register={register}
              />
              <Input
                name="datum_pocatku_text"
                label="předběžné datum pořátku"
                register={register}
              />
              <Input
                type="text"
                name="datum_pocatku"
                label="datum počátku"
                //type="date"
                register={register}
              />
              <Input
                type="text"
                name="datum_ukonceni_text"
                label="předběžné datum ukončení"
                register={register}
              />
              <Input
                type="text"
                name="datum_ukonceni"
                label="datum ukončení"
                //type="date"
                register={register}
              />

              <Select
                name="full_name"
                label="zajišťuje"
                options={[
                  { label: "Adolf", value: "Adolf" },
                  { label: "Billy", value: "Billy" },
                  { label: "Cecilia", value: "Cecilia" },
                  { label: "Tomáš Falc", value: "Tomáš Falc" },
                ]}
                register={register}
              />

              <button
                type="submit"
                tw="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline focus:transition-shadow focus:duration-300"
              >
                Uložit změny
              </button>
            </div>
          </div>
        </div>
      </form>
    </DetailWrapper>
  )
}

export default Detail
