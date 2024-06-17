/* eslint-disable react/prop-types */

import { CgCalendar } from "react-icons/cg";
import { FaLocationPin } from "react-icons/fa6";
import { SERVER_URL } from "../config/api";
import { Link } from "react-router-dom";


export default function EventCard({event}) {
  return (
    <div className="m-2 mx-5 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
              <img className="rounded-t-lg w-[400px] h-[200px]" src={`${SERVER_URL}/${event?.image}`} alt="" />
            </a>
            <div className="p-5">
              <a href="#">
                <h5 className="mb-1 text-lg font-bold tracking-tight text-primary-light dark:text-white">
                  {event?.name}
                </h5>
              </a>
              <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">
                {event?.description?.substring(0,100) + " ..."}
              </p>
              <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 flex justify-start items-center">
                <CgCalendar />
                {new Date(event?.date).toDateString()}
              </p>
              <p className="mb-2 font-normal text-gray-700 dark:text-gray-400 flex justify-start items-center">
                <FaLocationPin />
                {event?.location}
              </p>
              <Link
                to={`/event-detail/${event?.id}`}
                className="inline-flex j float-right items-center px-3 py-2 text-sm font-medium text-center text-white bg-primary-dark rounded-lg hover:bg-primary-light focus:ring-4 focus:outline-none focus:ring-primary-light dark:bg-primary-dark dark:hover:bg-primary-light dark:focus:ring-primary-dark"
              >
                View details
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            </div>
          </div>
  )
}
