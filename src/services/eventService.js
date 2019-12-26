let staticEvents = [
    {
      id: 1,
      name: 'Lorem',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu neque id nisl viverra faucibus. Nullam ac consectetur arcu. In gravida libero in velit accumsan interdum. Cras in massa magna',
      start: '2019-12-02',
      end: '2019-12-06',
      color: 'secondary'
    },
    {
      id: 2,
      name: 'ipsum',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu neque id nisl viverra faucibus. Nullam ac consectetur arcu. In gravida libero in velit accumsan interdum. Cras in massa magna',
      start: '2019-12-02',
      end: '2019-12-12',
      color: 'secondary'
    },
    {
      id:3,
      name: 'dolor',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu neque id nisl viverra faucibus. Nullam ac consectetur arcu. In gravida libero in velit accumsan interdum. Cras in massa magna',
      start: '2019-12-15',
      end: '2019-12-15',
      color: 'secondary'
    },
    {
      id: 4,
      name: 'sit',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu neque id nisl viverra faucibus. Nullam ac consectetur arcu. In gravida libero in velit accumsan interdum. Cras in massa magna',
      start: '2019-12-02',
      end: '2019-12-05',
      color: 'secondary'
    },
    {
      id: 5,
      name: 'amet',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu neque id nisl viverra faucibus. Nullam ac consectetur arcu. In gravida libero in velit accumsan interdum. Cras in massa magna',
      start: '2019-12-21',
      end: '2019-12-24',
      color: 'secondary'
    },
  ]

const getAll = () => {
  return staticEvents
}

const addOrUpdate = event => {
  if(event.id){
    updateEvent(event)
  } else {
    addOne(event)
  }
}



const addOne = event => {
  const eventToAdd = giveNewEventAnId(event)
  staticEvents.push(eventToAdd)
  console.log(staticEvents)
}

const updateEvent = eventToUpdate => {
  staticEvents = staticEvents.filter( event => event.id !== eventToUpdate.id )
  staticEvents.push(eventToUpdate) 
  console.log('updated', staticEvents)
}

const deleteEvent = (eventToDelete, identifier) => {
  console.log('deleted')
  staticEvents = staticEvents.filter(event => event[identifier] !== eventToDelete[identifier])  
  console.log(staticEvents)
}



const giveNewEventAnId = event => {
  return {
    ...event,
    id: getHighestAttribute('id') + 1
  }
}

const getHighestAttribute = (attribute) => {
  return staticEvents.reduce((prev, curr) => {
    return prev[attribute] >= curr[attribute]
        ? prev[attribute]
        : curr[attribute]
  })
}

export default {
  getAll,
  addOrUpdate,
  deleteEvent
}