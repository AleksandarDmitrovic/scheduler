import React from 'react';
import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import useVisualMode from '../../hooks/useVisualMode';

import 'components/Appointment/styles.scss'
import Form from './Form';
import Status from './Status';

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW));

  }


  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (<Form
        interviewers={props.interviewers}
        onCancel={() => back()}
        onSave={save}
      />)}
      {mode === SAVING && <Status />}
      {
        mode === SHOW && (<Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
        )
      }
    </article >
  );
}