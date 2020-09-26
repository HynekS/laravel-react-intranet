/** @jsx jsx */
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { jsx } from "@emotion/core"
import styled from "@emotion/styled"
import tw from "twin.macro"
import { useSelector, useDispatch } from "react-redux"

import { fetchActiveUsers } from "../../store/meta"
import Input from "../common/Input"
import Checkbox from "../common/Checkbox"
import Select from "../common/Select"
import ButtonStyledRadio from "./ButtonStyledRadio"

const StyledInput = tw.input`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:(outline-none bg-white border-blue-500)`
const StyledLabel = tw.label`block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4`
const RowWrapper = tw.div`md:flex md:items-center mb-2`
const LabelWrapper = tw.div`md:w-1/3`
const InputWrapper = styled.div`
  ${tw`md:w-2/3`}
  & .DayPickerInput input {
    ${tw`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:(outline-none bg-white border-blue-500)`}
  }
`

const DetailInput = ({ ...props }) => (
  <Input
    RootWrapperComponent={RowWrapper}
    LabelWrapperComponent={LabelWrapper}
    InputWrapperComponent={InputWrapper}
    InputComponent={StyledInput}
    LabelComponent={StyledLabel}
    {...props}
  />
)

const CreateProjectView = props => {
  const dispatch = useDispatch()
  const activeUsers = useSelector(store => store.meta.activeUsers)
  const { register, handleSubmit, setValue, watch, errors } = useForm({
    defaultValues: {
      id_stav: 1,
      nalez: "null",
    },
  })

  useEffect(() => {
    if (!activeUsers.length) {
      dispatch(fetchActiveUsers())
    }
  }, [])

  return (
    <div tw="w-full p-8">
      <div tw="p-8 bg-white rounded-lg">
        <h1 tw="text-xl">Nová akce</h1>
        <form
          onSubmit={() => {
            console.log("fake new project")
          }}
        >
          <div>
            <div>
              <div>
                <DetailInput
                  name="c_akce"
                  label="číslo akce"
                  placeholder="číslo akce"
                  register={register}
                />
                <DetailInput
                  name="nazev_akce"
                  label="název akce"
                  placeholder="název akce"
                  register={register}
                />
              </div>
            </div>
            <div>
              <div>
                <DetailInput
                  name="objednavka_cislo"
                  label="číslo objednávky"
                  placeholder="číslo objednávky"
                  register={register}
                />
                <Checkbox name="smlouva" label="smlouva podepsána" register={register} />
                <DetailInput
                  name="rozpocet_B"
                  label="rozpočet dohledy"
                  placeholder="Rozpočet dohledy"
                  register={register}
                />
                <DetailInput
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
                <DetailInput
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
                <DetailInput
                  name="investor_jmeno"
                  label="název investora"
                  placeholder="jméno investora"
                  register={register}
                />
                <DetailInput
                  name="investor_kontakt"
                  label="zástupce investora"
                  placeholder="zástupce investora"
                  register={register}
                />
                <DetailInput
                  name="investor_adresa"
                  label="sídlo investora"
                  placeholder="sídlo investora"
                  register={register}
                />
                <DetailInput
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
                <DetailInput
                  name="katastr"
                  label="katastr"
                  placeholder="katastr"
                  register={register}
                />
                <DetailInput
                  type="text"
                  name="okres"
                  label="okres"
                  placeholder="okres"
                  register={register}
                />
                <DetailInput
                  type="text"
                  name="kraj"
                  label="kraj"
                  placeholder="kraj"
                  register={register}
                />
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
                <DetailInput
                  name="datum_pocatku_text"
                  label="předběžné datum pořátku"
                  register={register}
                />
                <DetailInput
                  type="text"
                  name="datum_pocatku"
                  label="datum počátku"
                  //type="date"
                  register={register}
                />
                <DetailInput
                  type="text"
                  name="datum_ukonceni_text"
                  label="předběžné datum ukončení"
                  register={register}
                />
                <DetailInput
                  type="text"
                  name="datum_ukonceni"
                  label="datum ukončení"
                  //type="date"
                  register={register}
                />

                <Select
                  name="user_id"
                  label="zajišťuje"
                  options={activeUsers.map(user => ({
                    label: user.full_name,
                    value: user.id,
                  }))}
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
      </div>
    </div>
  )
}

export default CreateProjectView
