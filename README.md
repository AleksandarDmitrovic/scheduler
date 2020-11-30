# Interview Scheduler

Interview Scheduler is a single-page interview booking application.

Using the latest tools and techniques, I built and tested this as a React application that allows users to book, edit and cancel interviews. Using a combination of concise APIs with a WebSocket server to build a real-time experience. This project was made as part of the requirements for Lighthouse Labs' Web Development Bootcamp and utilizes code provided in the curriculum. 

Users create interviews by entering their name and choosing an interviewer from a list. By hovering over an interview a user can view edit and delete buttons. The saving and deleting operations initiate spinner animations letting the user know their request are being processed. Once requests are successful the interviews are displayed automatically to all users using the application. If a request is unsuccessful an error message will appear which a user can close and then retry their request.

This application has been deployed with the server on Heroku, and the client-side on Netlify. Click the link below to see the deployed application. Please refresh the page first to initiate the Heroku server spin up. 

Live App: https://ecstatic-kowalevski-cf8501.netlify.app/

## Final Product
Edit and delete buttons are displayed when hovering over an existing appointment.
!["Screenshot of the Interview Scheduler Home Page "](https://github.com/AleksandarDmitrovic/scheduler/blob/master/docs/home-page.png?raw=true)
Appointment creation form allows users to enter their names and pick an interviewer from a list.
!["Screenshot of an appointment form"](https://github.com/AleksandarDmitrovic/scheduler/blob/master/docs/appointment-form.png?raw=true)
Prompt to confirm deleting an interview.
!["Screenshot of appointment delete confirmation"](https://github.com/AleksandarDmitrovic/scheduler/blob/master/docs/delete-confirmation.png?raw=true)
Spinner animation displays while requests are made to the server. Deleting interview in this case.
!["Screenshot of appointment deleting"](https://github.com/AleksandarDmitrovic/scheduler/blob/master/docs/appointment-deleting.png?raw=true)

## Setup
Clone repo and  Install dependencies with `npm install`. Clone and follow README from this repo [scheduler-api](https://github.com/AleksandarDmitrovic/scheduler-api).

## Dependencies
- axios 0.21.0 or above
- classnames: 2.2.6 or above
- normalize.css: 8.0.1 or above
- react: 16.9.0 or above
- react-dom: 16.9.0 or above
- react-scripts: 3.0.0

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
