import React, { useState, useEffect } from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function Events() {
  const [selectedOption, setSelectedOption] = useState("today");
  const [next7DaysEvents, setNext7DaysEvents] = useState([]);

  useEffect(() => {
    // Fetch or update the events data for the next 7 days here
    // For this example, I'm using a mock data array
    const newEventsData = [
      { title: "NCAT 1", date: new Date(2023, 5, 1, 10, 0), candidates: 50 },
      { title: "NCAT 2", date: new Date(2023, 5, 3, 15, 30), candidates: 60 },
      { title: "NCAT 3", date: new Date(2023, 5, 4, 9, 45), candidates: 70 },
      { title: "NCAT 4", date: new Date(2023, 5, 5, 14, 15), candidates: 80 },
      { title: "NCAT 5", date: new Date(2023, 5, 6, 12, 15), candidates: 90 },
    ];

    setNext7DaysEvents(newEventsData);
  }, []);

  const todayEvents = next7DaysEvents.filter(
    (event) => event.date.getDate() === new Date().getDate()
  );

  const next7DaysFilteredEvents = next7DaysEvents.filter(
    (event) => event.date.getDate() !== new Date().getDate()
  );

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <div className="container ml-2 pl-4 pr-4 my-4 py-2 bg-gray-100">
        <div className="grid grid-cols-2 xl:grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-9 h-50"></div>
          <div className="col-span-12 xl:col-span-3 mr-2">
            <div className="flex bg-white flex-col pb-10 pl-6 pt-2 shadow-lg rounded-md">
              <p className="text-blue-900 font-bold text-xl">EVENTS</p>
              <div className="text-sm">
                <p>
                  <span
                    className={`text-emerald-700 font-bold option ${selectedOption === "today" ? "selected" : ""
                      } cursor-pointer`}
                    onClick={() => handleOptionClick("today")}
                  >
                    Today
                  </span>
                  <span className="text-emerald-700 font-bold">&nbsp;|&nbsp;</span>
                  <span
                    className={`text-emerald-700 font-bold option ${selectedOption === "next7days" ? "selected" : ""
                      } cursor-pointer`}
                    onClick={() => handleOptionClick("next7days")}
                  >
                    Next 7 days
                  </span>
                </p>
              </div>
              {selectedOption === "today" ? (
                <div className="text-md pt-4">
                  {todayEvents.length > 0 ? (
                    todayEvents.map((event) => (
                      <div key={event.title} className="text-black text-sm pb-1">
                        <p className="font-semibold">
                          {event.title}, Candidates: {event.candidates}
                        </p>
                        <p>
                          <CalendarMonthIcon
                            fontSize="small"
                            className="mr-1 mb-1 text-gray-400"
                          />
                          <span className="text-gray-600">
                            {event.date.toLocaleString('en-us', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true
                            })}
                          </span>
                          &nbsp;-&nbsp;
                          <span className="text-gray-600">
                            {new Date(event.date.getTime() + 1 * 60 * 60 * 1000).toLocaleString('en-us', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true
                            })}
                          </span>
                        </p>
                        <hr className="my-1 mr-4" />
                      </div>
                    ))
                  ) : (
                    <p>No events found for today.</p>
                  )}
                </div>
              ) : (
                <div className="text-md pt-4">
                  {next7DaysFilteredEvents.length > 0 ? (
                    next7DaysFilteredEvents.map((event) => (
                      <div key={event.title} className="text-black text-sm pb-1">
                        <p className="font-semibold">
                          {event.title}, Candidates: {event.candidates}
                        </p>
                        <p>
                          <CalendarMonthIcon
                            fontSize="small"
                            className="mr-1 mb-1 text-gray-400"
                          />
                          <span className="text-gray-600">
                            {event.date.toLocaleString('en-us', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true
                            })}
                          </span>
                          &nbsp;-&nbsp;
                          <span className="text-gray-600">
                            {new Date(event.date.getTime() + 1 * 60 * 60 * 1000).toLocaleString('en-us', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true
                            })}
                          </span>
                        </p>
                        <hr className="my-1 mr-4" />
                      </div>
                    ))
                  ) : (
                    <p>No events found for the next 7 days.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Events;