import React, { useState } from 'react';
import InterviewerList, { setInterviewer } from 'components/InterviewerList';
import Button from 'components/Button';

const Form = function (props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  const validate = () => {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    props.onSave(name, interviewer);
  };

  const changeName = (event) => {
    setName(event.target.value);
  };
  const reset = () => {
    setName("");
    setInterviewer(null);
  };
  const cancel = () => {
    reset();
    props.onCancel();
  };
  const save = function () {
    validate()
  };


  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            onChange={changeName}
            value={name}
            data-testid="student-name-input"
          /*
            This must be a controlled component
          */
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={save}>Save</Button>
        </section>
      </section>
    </main>
  );
}

export default Form;