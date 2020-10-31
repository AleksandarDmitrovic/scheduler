// BELOW IS THE CODE BEFORE AND AFTER THE WEBSOCKET REFACTOR
// I use to call useReducer inside of the book/deleteInterview functions with dispatch({ type: SET_INTERVIEW, id, interview }) 
// but now I only call it withing the webSocket listener onMessage when there is a response signaling a database change
// I also move the logic inside the setSpotsRemaining function into the reducer function case SET_INTERVIEW


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
      const id = action.id;
      const interview = action.interview ? { ...action.interview } : null;
      console.log('interview :', interview);
      const appointment = {
        ...state.appointments[id],
        interview
      };
      console.log('appointment :', appointment);
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      let numOfSpotsRemaining;
      /////////////////////////////////////////////////
      let days = [
        ...state.days
      ]

      const [theSpotsDay] = days.filter(day => {
        return day.appointments.includes(id)
      })

      if (interview === null) {
        numOfSpotsRemaining = theSpotsDay.spots + 1
      } else {
        numOfSpotsRemaining = theSpotsDay.spots - 1
      }

      theSpotsDay.spots = numOfSpotsRemaining

      days[parseInt(theSpotsDay.id, 10) - 1] = theSpotsDay;
      ////////////////////////////////////////////////////
      return {
        ...state,
        appointments,
        days
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

  // const setSpotsRemaining = (id, interview) => {
  //   let numOfSpotsRemaining;
  //   let days = [
  //     ...state.days
  //   ]

  //   const [theSpotsDay] = days.filter(day => {
  //     return day.appointments.includes(id)
  //   })
  //   console.log('theSpotsDay :', theSpotsDay);

  //   if (interview === null) {
  //     numOfSpotsRemaining = theSpotsDay.spots + 1
  //   } else {
  //     numOfSpotsRemaining = theSpotsDay.spots - 1
  //   }

  //   theSpotsDay.spots = numOfSpotsRemaining

  //   days[parseInt(theSpotsDay.id, 10) - 1] = theSpotsDay;

  //   return days
  // }


  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      const dataArr = all.map((res) => res.data)
      const [days, appointments, interviewers] = dataArr
      console.log("CALLED WEBSOCKET DISPATCH")
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
    })

  }, [])




  const bookInterview = (id, interview) => {
    // const days = setSpotsRemaining(id, interview)

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(res => {
        // console.log('res :', res);
        console.log("CALLED BOOKINTERVIEW")
        // dispatch({ type: SET_INTERVIEW, id, interview }); //, days
      })
  }

  const deleteInterview = (id, interview = null) => {
    // const days = setSpotsRemaining(id, interview)
    console.log('interview :', interview);

    return axios.delete(`/api/appointments/${id}`, { data: { interview } })
      .then(res => {
        // console.log('res :', res);
        console.log("CALLED DELETEINTERVIEW")
        // dispatch({ type: SET_INTERVIEW, id, interview }); //, days
      })
  }

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onopen = event => {
      webSocket.send("ping")
    }
    webSocket.onmessage = event => {
      console.log("Message Received:", event.data);
    }
    webSocket.onmessage = event => {
      const message = JSON.parse(event.data);
      console.log('message :', message);

      if (message.type === "SET_INTERVIEW") {
        const id = message.id
        const interview = message.interview  //|| null
        dispatch({ type: SET_INTERVIEW, id, interview })
      }
    }
    //Cleanup needed
    // webSocket.close();


  }, []) //state.appointments



  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}

export default useApplicationData;