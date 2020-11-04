import React from "react";
import axios from 'axios';
import WS from "jest-websocket-mock";

import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, getByDisplayValue } from "@testing-library/react";

import Application from "components/Application";


afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();


  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const server = new WS("ws://localhost:8001");//Websockets

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    server.send(`{"type":"SET_INTERVIEW","id":1,"interview":{"student":"Lydia Miller-Jones","interviewer":2}}`);//Websockets

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

    server.close()//Websockets

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const server = new WS("ws://localhost:8001");//Websockets

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the first filled appointment. ----Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment")
      .find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the element with the text "Are you sure you would like to delete" is displayed. ---Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on that same appointment. --  Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    server.send(`{"type":"SET_INTERVIEW","id":2,"interview":null}`);//Websockets

    // 7. Wait until the element with the Add button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2" spots remaining.
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    server.close()//Websockets
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const server = new WS("ws://localhost:8001");

    // 1. Render the Application.
    const { container } = render(<Application />);


    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment")
      .find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Check that the element with the text "Archie Cohen" is displayed. 
    expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();

    // 5. Edit the student name / interviewer
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    server.send(`{"type":"SET_INTERVIEW","id":2,"interview":{"student":"Lydia Miller-Jones","interviewer":1}}`);//Websockets

    // 8. Wait until the element with the new student text "Lydia Miller-Jones" is displayed and check it.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"))

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

    server.close()//Websockets
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => getByText(appointment, "Error Saving"));

    expect(getByText(appointment, "Error Saving")).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, "Close"));

    expect((getByAltText(appointment, "Add"))).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")
      .find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Error Deleting"));

    expect(getByText(appointment, "Error Deleting")).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, "Close"));

    expect(queryByText(appointment, "Archie Cohen")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });




});

