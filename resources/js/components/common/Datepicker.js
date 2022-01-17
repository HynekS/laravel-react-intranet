import React from "react"
import DayPickerInput from "react-day-picker/DayPickerInput"
import "react-day-picker/lib/style.css"

const CustomDayPickerInput = ({ label, name, register, ...props }) => (
  <div className="rowWrapper">
    <div className="labelWrapper">
      <StyledLabel>datum počátku</StyledLabel>
    </div>
    <div className="inputWrapper">
      {typeof register === "function" ? (
        <Controller
          as={DayPickerInput}
          control={control}
          name="datum_pocatku"
          format="d. M. yyyy"
          formatDate={date => new Intl.DateTimeFormat("cs-CZ").format(date)}
          parseDate={date => {
            if (date.match(/(\d{1,2})\. ?(\d{1,2})\. ?(\d{4})/)) {
              let testDate = new Date(swapCzDateToISODate(date))
              return isValidDate(testDate) && testDate
            }
          }}
          placeholder="d. M. yyyy"
          value={new Date(detail?.datum_pocatku)}
          dayPickerProps={{
            locale: "cs-CZ",
            months: monthsCZ,
            weekdaysLong: daysCZ,
            weekdaysShort: daysShortCZ,
            firstDayOfWeek: 1,
            selectedDays:
              (dateValues.datum_pocatku || detail?.datum_pocatku) &&
              new Date(swapCzDateToISODate(dateValues.datum_pocatku || detail?.datum_pocatku)),
          }}
        />
      ) : (
        <DayPickerInput {...props} />
      )}
    </div>
  </div>
)

export default CustomDayPickerInput
