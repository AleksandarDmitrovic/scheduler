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
      //Check for editing before state change
      const checkInterview = {
        ...state.appointments[action.id]
      }

      let editingAppointment = false;
      if (checkInterview.interview !== null) {
        editingAppointment = true;
      }
      // let editingAppointment = checkInterview.interview !== null;


      const id = action.id;
      const interview = action.interview ? { ...action.interview } : null;

      const appointment = {
        ...state.appointments[id],
        interview
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      //Calculating Spots Reamining on UI side
      let numOfSpotsRemaining;
      let days = [
        ...state.days
      ]

      let [theSpotsDay] = days.filter(day => {
        return day.appointments.includes(id)
      })

      if (interview === null) {
        numOfSpotsRemaining = theSpotsDay.spots + 1
      } else if (editingAppointment) {
        numOfSpotsRemaining = theSpotsDay.spots
      } else {
        numOfSpotsRemaining = theSpotsDay.spots - 1
      }



      // /////// Jeremy starts rambling like a fool


      // // idempotence
      // // idem potence
      // // idem: same
      // // potence: ability to have an effect / strength / power / magicalpower


      // // recalculate all the days's spots.  who cares what they were.

      // const countSpotsOneDay = (dayObj, state) => {
      //   let answer = 0;
      //   for (let apptId of dayObj.appointments) {
      //     if (state.appointments[apptId].interview === null) {
      //       answer++;
      //     }
      //   }
      //   return answer;
      // };

      // const days = state.days.map(day => {
      //   let newSpotCount = countSpotsOneDay(day, state);
      //   return { ...day, spots: newSpotCount };
      // });

      // //loop through interviews arr and count which interview is null

      // // const days = [];
      // // for (let day of state.days) {
      // //   // stuff
      // //   days.push(day);
      // // }



      // /////// Jeremy generally decreased the quantity of rambling like a fool


      // theSpotsDay.spots = numOfSpotsRemaining
      theSpotsDay = { ...theSpotsDay, spots: numOfSpotsRemaining };
      days[parseInt(theSpotsDay.id, 10) - 1] = theSpotsDay;

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


  const bookInterview = (id, interview) => {

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview })
      })
  }

  const deleteInterview = (id, interview = null) => {

    return axios.delete(`/api/appointments/${id}`, { data: { interview } })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview })
      })
  }

  // useEffect(() => {
  //   const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
  //   webSocket.onopen = event => {
  //     webSocket.send("ping")
  //   }
  //   webSocket.onmessage = event => {
  //     console.log("Message Received:", event.data);
  //   }
  //   webSocket.onmessage = event => {
  //     const message = JSON.parse(event.data);
  //     console.log('message :', message);

  //     if (message.type === "SET_INTERVIEW") {
  //       const id = message.id
  //       const interview = message.interview
  //       dispatch({ type: SET_INTERVIEW, id, interview })
  //     }
  //   }
  //   //Cleanup 
  //   return () => webSocket.close();

  // }, [])



  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}

export default useApplicationData;