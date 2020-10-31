import React, { useEffect } from 'react';

import 'components/Appointment/styles.scss'

import useVisualMode from '../../hooks/useVisualMode';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }

    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [props.interview, transition, mode])

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => { transition(ERROR_SAVE, true) });
  }

  const confirmDelete = () => {
    transition(CONFIRM);
  }
  const cancel = () => back();
  const deleting = () => {
    transition(DELETING, true)
    props.deleteInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => { transition(ERROR_DELETE, true) });
  };


  const edit = () => {
    transition(EDIT)
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
      {mode === EDIT && (<Form
        interviewer={props.interview.interviewer.id}
        name={props.interview.student}
        interviewers={props.interviewers}
        onCancel={() => back()}
        onSave={save}
      />)}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === ERROR_SAVE && <Error message={"Error Saving"} onClose={() => back()} />}
      {mode === SHOW && props.interview && (<Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={confirmDelete}
        onEdit={edit}
      />)}
      {mode === CONFIRM && (<Confirm
        message={"Are you sure you would like to delete"}
        onCancel={cancel}
        onConfirm={deleting}
      />)}
      {mode === DELETING && <Status message={"Deleting"} />}
      {mode === ERROR_DELETE && <Error message={"Error Deleting"} onClose={() => back()} />}

    </article >
  );
}