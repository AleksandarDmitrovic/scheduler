import { useEffect, useReducer } from 'react';
import axios from 'axios';

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application"

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
      const dataArr = all.map((res) => res.data);
      const [days, appointments, interviewers] = dataArr;

      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
    })

  }, [])

  //COMMENTED OUT CODE (Lines 39-41 + 47-49) WHEN IMPLEMENTED ALLOW ALL TESTS in src/components/__tests__/Application.test.js TO PASS
  //Lines 53 - 74 must also be commented out for the integration tests.
  //DON'T YET HAVE TEST THAT CAN MOCK WEBSOCKETS FEATURE
  const bookInterview = (id, interview) => {

    return axios.put(`/api/appointments/${id}`, { interview })
    // .then(() => {
    //   dispatch({ type: SET_INTERVIEW, id, interview })
    // })
  }

  const deleteInterview = (id, interview = null) => {

    return axios.delete(`/api/appointments/${id}`, { data: { interview } })
    // .then(() => {
    //   dispatch({ type: SET_INTERVIEW, id, interview })
    // })
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

      if (message.type === "SET_INTERVIEW") {
        const id = message.id
        const interview = message.interview
        dispatch({ type: SET_INTERVIEW, id, interview })
      }
    }
    //Cleanup 
    return () => webSocket.close();

  }, [])



  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}

export default useApplicationData;