import DateArithmetic from '../../src/services/DateArithmetic'
import { exportAllDeclaration } from '@babel/types'

test('returns day suffix with number input', () => {
    const nth = DateArithmetic.nth

    expect(nth(1)).toBe('st')
    expect(nth(7)).toBe('th')
    expect(nth(9)).toBe('th')
    expect(nth(81)).toBe('st')
    expect(nth(42)).toBe('nd')
})

test('should return the date of last day of a month', () => {
    const getLastDayOfMonth = DateArithmetic.getLastDayOfMonth

    expect(getLastDayOfMonth('2020-01-01')).toBe('2020-01-31')
    expect(getLastDayOfMonth('2020-02-01')).toBe('2020-02-29')
    expect(getLastDayOfMonth('2021-02-01')).toBe('2021-02-28')
    expect(getLastDayOfMonth('2020-12-14')).toBe('2020-12-31')
})

test('should convert YYYY-MM-DD string to dateobject', () => {
    const dateStringToObject = DateArithmetic.dateStringToObject

    let dateObject = new Date(2020,7,27)
    expect(dateStringToObject('2020-08-27 19:00')).toMatchObject(dateObject)
    dateObject = new Date(2020,0,1)
    expect(dateStringToObject('2020-01-01')).toMatchObject(dateObject)
    dateObject = new Date(2020,11,24)
    expect(dateStringToObject('2020-12-24')).toMatchObject(dateObject)

})

test('should convert dateObject to YYYY-MM-DD string', () => {
    const dateObjectToString = DateArithmetic.dateObjectToString

    let dateObject = new Date(2019,2,5)
    expect(dateObjectToString(dateObject)).toBe('2019-03-04')
    dateObject = new Date(2030,1,28)
    expect(dateObjectToString(dateObject)).toBe('2030-02-27')
})

test('should return true if YYYY-MM-DD date one is before date two',() =>{
    const isDateBeforeDate = DateArithmetic.isDateBeforeDate

    expect(isDateBeforeDate('2020-02-01','2020-05-13')).toBe(true)
    expect(isDateBeforeDate('2020-07-01','2020-05-13')).toBe(false)
    expect(isDateBeforeDate('2025-02-01','2020-01-01')).toBe(false)
})







