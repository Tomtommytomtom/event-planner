import Event from '../../src/services/Events/Events'

let events = []

const startDates = [
  '2020-02-01 03:00',
  '2019-07-11 17:00',
  '2020-10-27',
  '2020-04-02',
  '2030-12-31 21:00'
]
const endDates = [
  '2020-02-04 01:01',
  '2019-08-11',
  '2020-11-02 15:00',
  '2020-04-11',
  '2031-01-01 23:00'
]

for (let i = 0; i < startDates.length; i++) {
  const newEvent = new Event({
    name: 'test' + i,
    details: 'test' + i + ' details',
    start: startDates[i],
    end: endDates[i],
    color: '#cc1616'
  })
  events.push(newEvent)
}

test('should return start time string concat with space or empty string', () => {
  const expectedValues = [' 03:00', ' 17:00', '', '', ' 21:00']

  events.forEach((event, index) => {
    expect(event.getStartTime()).toBe(expectedValues[index])
  })
})

test('should return end time string concat with space or empty string', () => {
  const expectedValues = [' 01:01', '', ' 15:00', '', ' 23:00']

  events.forEach((event, index) => {
    expect(event.getEndTime()).toBe(expectedValues[index])
  })
})

test('should return start date in x days', () => {
  const days = [1, 10, 5, 33, 7]
  const expectedValues = [
    '2020-02-02',
    '2019-07-21',
    '2020-11-01',
    '2020-05-05',
    '2031-01-07'
  ]

  events.forEach((event, index) => {
    expect(event.getStartDateInXDays(days[index])).toBe(expectedValues[index])
  })
})
