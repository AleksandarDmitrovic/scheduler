import React from "react";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application"


describe("Application", () => {
  it("throws an error with an unsupported type", async () => {
    // const { getByText } = render(<Application />);
    const state = {};
    const unsupportedActionType = "ERROR_TYPE";
    // reducer(state, unsupportedActionType).toThrowError()

    expect(() => reducer(state, unsupportedActionType)).toThrowError(
      /tried to reduce with unsupported action type/i
    );


  });
});