const getAppointmentsForDay = function (state, day) {
  //... returns an array of appointments for that day
  let results = [];
  const filteredDay = state.days.filter(dayOfWeek => dayOfWeek.name === day);
  if (filteredDay.length === 0) {
    return results;
  }
  const appointmentArr = filteredDay[0].appointments;

  for (const key in (state.appointments)) {
    const keyToNum = Number(key)
    if (appointmentArr.includes(keyToNum)) {
      results.push(state.appointments[key])
    }
  }

  return results;
}

const getInterview = function (state, interview) {
  if (interview === null) {
    return null;
  }
  const interviewerID = interview.interviewer;

  for (const key in (state.interviewers)) {
    const keyToNum = Number(key)
    if (interviewerID === keyToNum) {
      return { ...interview, interviewer: { ...(state.interviewers[key]) } }
    }
  }
}

export { getAppointmentsForDay, getInterview };