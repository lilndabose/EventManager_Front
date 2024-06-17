import {useState} from 'react'
import api from '../../../config/api';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { saveNotification } from '../../../utils/notifications';

export default function AddEvent() {
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage,setSuccessMessage] = useState("")
  const [file,setFile] = useState(null)

  const getFile=async(e)=>{
    setFile(e.target.files[0])
  }
  const saveEvent=async(values,setSubmitting)=>{
    let eventData = new FormData();
    

    eventData.append("name",values?.name);
    eventData.append("description", values?.description);
    eventData.append("location",values?.location)
    eventData.append("date",values?.datetime?.split("T")[0])
    eventData.append("time",values?.datetime?.split("T")[1])
    eventData.append("image",file)
    eventData.append("users[]",loggedUser?.id?.toString())

    try {
        const res = await api.post("/events", eventData);
        if (res.status === 200 || res.status === 201 || res.statusText.toLowerCase() == "ok") {
            // eslint-disable-next-line no-unused-vars
            const sendNotifStatus = await saveNotification(loggedUser?.id,`New event with name: ${values?.name} created !!!`,'all');
            setSuccessMessage('Event created successsfully !!!')
            values = {name: "", description: "", location: "" ,datetime:""}
            setTimeout(()=>{
              setErrorMessage('')
              setSuccessMessage('')

              window.location.reload();
            },1500)
        }
      } catch (err) {
        setErrorMessage("An error while saving event try again !!!");
      } finally {
        setSubmitting(false);
      }
  }
    
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
    <div className="mb-1 text-2xl  w-full h-auto overflow-hidden flex justify-center items-center text-primary-dark">
      <h2>Add New Event</h2>
    </div>
    <Formik
      initialValues={{ name: "", description: "", location: "" ,datetime:"",image:null}}
      validate={(values) => {
        const errors = {};
        if (!values.name) {
          errors.name = "Event name is required !!!";
        } 
        if (!values.description) {
          errors.description = "Description is required !!!";
        }
        if (!values.location) {
          errors.location = "Location is required !!!";
        }
        if(!values.datetime){
          errors.datetime = "Date and time of event is required !!!"
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        saveEvent(values, setSubmitting);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="w-5/6 p-4 rounded-md overflow-hidden">
          <h2 className="text-red-700 font-bold text-center">
            {errorMessage}
          </h2>
          <h2 className="text-green-700 font-bold text-center">
            {successMessage}
          </h2>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Event name
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Ex: Dance event"
            />
            <ErrorMessage
              name="name"
              component="div"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="description"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <Field
              type="text"
              id="description"
              name="description"
              placeholder="Ex: learn the best dance styles ..."
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
            <ErrorMessage
              name="description"
              component="div"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="location"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Location
            </label>
            <Field
              type="text"
              id="location"
              name="location"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
            <ErrorMessage
              name="location"
              component="div"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="datetime"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Event Date and Time
            </label>
            <Field
              type="datetime-local"
              id="datetime"
              name="datetime"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
            <ErrorMessage
              name="datetime"
              component="div"
              style={{ color: "red" }}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="datetime"
              className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Select Event Banner Image
            </label>
            <input type='file' onChange={getFile} required/>
            {/* <Field
              type="file"
              id="image"
              name="image"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
            <ErrorMessage
              name="image"
              component="div"
              style={{ color: "red" }}
            /> */}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`text-white ${isSubmitting ? 'bg-primary-light':'bg-primary-dark'} hover:bg-primary-light focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-light dark:focus:ring-primary-light`}
          >
           Save Event
          </button>
        </Form>
      )}
    </Formik>
  </div>
  )
}
