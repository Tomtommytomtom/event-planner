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




