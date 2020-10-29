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


  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(res => {
        console.log('res :', res);
        setState({
          ...state,
          appointments
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
    return axios.delete(`/api/appointments/${id}`, { data: { interview } })
      .then(res => {
        console.log('res :', res);
        setState({
          ...state,
          appointments
        });
      })
  }




  return {
    state,
    setState,
    setDay,
    bookInterview,
    deleteInterview
  }
}

export default useApplicationData;