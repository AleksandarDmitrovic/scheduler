import { useEffect, useReducer } from 'react';
import axios from 'axios';

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      }
    case SET_INTERVIEW: {
      const appointment = {
        ...state.appointments[action.id],
        interview: { ...action.interview }
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
      return {
        ...state,
        appointments,
        days: action.days
      }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });


  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      const dataArr = all.map((res) => res.data)
      const [days, appointments, interviewers] = dataArr

      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
    })

  }, [])


  const setSpotsRemaining = (id, incrementing) => {
    let numOfSpotsRemaining;
    let days = [
      ...state.days
    ]

    const [theSpotsDay] = days.filter(day => {
      return day.appointments.includes(id)
    })

    if (incrementing) {
      numOfSpotsRemaining = theSpotsDay.spots + 1
    } else {
      numOfSpotsRemaining = theSpotsDay.spots - 1
    }

    theSpotsDay.spots = numOfSpotsRemaining

    days[parseInt(theSpotsDay.id, 10) - 1] = theSpotsDay;

    return days
  }


  const bookInterview = (id, interview) => {
    const days = setSpotsRemaining(id, false)

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(res => {
        console.log('res :', res);
        dispatch({ type: SET_INTERVIEW, id, interview, days });
      })
  }

  const deleteInterview = (id, interview = null) => {
    const days = setSpotsRemaining(id, true)

    return axios.delete(`/api/appointments/${id}`, { data: { interview } })
      .then(res => {
        console.log('res :', res);
        dispatch({ type: SET_INTERVIEW, id, interview, days });
      })
  }




  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}

export default useApplicationData;