const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const reducer = (state, action) => {
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

      const appointment = {
        ...state.appointments[id],
        interview
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      //Calculating Spots Remaining on UI side

      //loop through interviews arr and count which interview is null
      const countSpotsOneDay = (dayObj) => {
        let answer = 0;
        for (let apptId of dayObj.appointments) {
          if (appointments[apptId].interview === null) {
            answer++;
          }
        }
        return answer;
      };

      const days = state.days.map(day => {
        let newSpotCount = countSpotsOneDay(day);
        return { ...day, spots: newSpotCount };
      });


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

export default reducer;
export { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW };