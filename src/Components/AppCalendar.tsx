import { ChevronRightSvg } from '@/Assets/Svg'
import { AppButton, Obx } from '@/Components'
import { AppFonts, Colors, screenWidth, XStyleSheet } from '@/Theme'
import { getMonths, getWeekdays } from '@/Utils'
import { useLocalObservable } from 'mobx-react-lite'
import React, { memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import CalendarPicker, {
  CalendarPickerProps,
} from 'react-native-calendar-picker'

interface AppCalendarProps extends CalendarPickerProps {
  onSelectDate: (from: Date, to: Date) => void
  fromDate?: Date
  toDate?: Date
  allowRangeSelection?: boolean
  showButton?: boolean
}

const AppCalendar = ({
  onSelectDate,
  fromDate,
  toDate,
  allowRangeSelection,
  showButton = false,
  ...calendarPickerProps
}: AppCalendarProps) => {
  const { t } = useTranslation()
  const calendarRef = React.useRef(null)
  const state = useLocalObservable(() => ({
    selectedStartDate: null,
    setSelectedStartDate: selectedStartDate => {
      state.selectedStartDate = selectedStartDate
    },
    selectedEndDate: null,
    setSelectedEndDate: selectedEndDate => {
      state.selectedEndDate = selectedEndDate
    },
  }))

  useEffect(() => {
    state.setSelectedStartDate(fromDate)
    state.setSelectedEndDate(toDate)
  }, [])

  const handleOnDateChange = useCallback((date, type) => {
    if (type === 'END_DATE') {
      state.setSelectedEndDate(date)
    } else {
      state.setSelectedEndDate(date)
      state.setSelectedStartDate(date)
    }
  }, [])

  const onComplete = () => {
    onSelectDate &&
      onSelectDate(
        state.selectedStartDate,
        state.selectedEndDate || state.selectedStartDate,
      )
  }

  return (
    <Obx>
      {() => (
        <View style={styles.containerBottomSheet}>
          <CalendarPicker
            initialDate={fromDate}
            ref={calendarRef}
            startFromMonday={true}
            allowRangeSelection={allowRangeSelection}
            weekdays={getWeekdays(t)}
            months={getMonths(t)}
            selectedStartDate={state.selectedStartDate}
            selectedEndDate={state.selectedEndDate}
            nextComponent={<ChevronRightSvg />}
            previousComponent={
              <View style={styles.transform}>
                <ChevronRightSvg />
              </View>
            }
            selectMonthTitle={`${t('date.select_month')} `}
            selectYearTitle={t('date.select_year')}
            disabledDatesTextStyle={styles.textDisableDays}
            allowBackwardRangeSelect={true}
            todayBackgroundColor={Colors.gray}
            selectedDayColor={Colors.primary}
            selectedDayTextColor={Colors.white}
            textStyle={styles.textDays}
            selectedRangeStartStyle={{ backgroundColor: Colors.primary }}
            selectedRangeEndStyle={{ backgroundColor: Colors.primary }}
            onDateChange={handleOnDateChange}
            dayLabelsWrapper={{ borderBottomWidth: 0, borderTopWidth: 0 }}
            headerWrapperStyle={{ paddingHorizontal: screenWidth * 0.1 }}
            monthTitleStyle={styles.monthYearTitle}
            yearTitleStyle={styles.monthYearTitle}
            width={screenWidth * 0.95}
            selectedRangeStyle={{
              width: (screenWidth * 0.95) / 7,
            }}
            {...calendarPickerProps}
          />
          {showButton && (
            <View style={styles.containerBottomButton}>
              <AppButton
                backgroundColor={Colors.primary}
                text={t('done').toLocaleUpperCase()}
                textColor={Colors.white}
                onPress={onComplete}
              />
            </View>
          )}
        </View>
      )}
    </Obx>
  )
}
const styles = XStyleSheet.create({
  transform: { transform: [{ rotateZ: '180deg' }] },
  iconNext: {
    width: 32,
    height: 32,
  },
  monthYearTitle: {
    color: Colors.black,
    fontSize: 16,
    opacity: 0.6,
    fontFamily: AppFonts['500'],
  },
  containerBottomSheet: {},
  textDays: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: AppFonts['600'],
  },
  textDisableDays: {
    color: Colors.black,
    fontSize: 16,
    opacity: 0.2,
    fontFamily: AppFonts['500'],
  },
  containerBottomButton: {
    marginTop: 25,
    marginHorizontal: 16,
  },
})
export default memo(AppCalendar)
