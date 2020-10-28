import React, { useState, useEffect } from "react";
import axios from "axios";

import DayList from 'components/DayList'
import Appointment from 'components/Appointment/index';
import { getAppointmentsForDay, getInterview } from 'helpers/selectors';

import "components/Application.scss";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({ ...state, day })


  useEffect(() => {
    const daysAPI = 'http://localhost:8001/api/days';
    const appointmentsAPI = 'http://localhost:8001/api/appointments';
    const interviewersAPI = 'http://localhost:8001/api/interviewers';
    Promise.all([
      axios.get(daysAPI),
      axios.get(appointmentsAPI),
      axios.get(interviewersAPI)
    ]).then(all => {
      console.log('all :', all);
      setState(prev =>
        ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }))
    })

  }, [])

  const appointments = getAppointmentsForDay(state, state.day);

  const schedule = appointments.map(appointment => {
    const interview = getInterview(state, appointment.interview)

    return (
      <Appointment
        key={appointment.id}
        {...appointment}
        // id={appointment.id}
        // time={appointment.time}
        interview={interview}
      />
    );
  })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
