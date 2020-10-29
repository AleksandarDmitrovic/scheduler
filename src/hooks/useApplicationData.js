import { useState, useEffect } from 'react';
import axios from 'axios';

const useApplicationData = () => {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({ ...state, day })

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      // console.log('all :', all);
      setState(prev =>
        ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }))
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
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = setSpotsRemaining(id, false)

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(res => {
        console.log('res :', res);
        setState({
          ...state,
          appointments,
          days
        });
      })
  }

  const deleteInterview = (id, interview = null) => {

    const appointment = {
      ...state.appointments[id],
      interview: interview
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = setSpotsRemaining(id, true)

    return axios.delete(`/api/appointments/${id}`, { data: { interview } })
      .then(res => {
        console.log('res :', res);
        setState({
          ...state,
          appointments,
          days
        });
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