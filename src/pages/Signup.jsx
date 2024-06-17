import { useState } from "react";
import { GiLockSpy } from "react-icons/gi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import api from "../config/api";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const saveUser = async (user, setSubmitting) => {
    try {
      const res = await api.post("/users", user);
      if (res.status === 200 || res.status === 201 || res.statusText.toLowerCase() == "ok") {
        navigate("/login");
      }
    } catch (err) {
      setErrorMessage("An error occured when signing up try again !!!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="mb-2 p-4 border-2 bg-primary-light rounded-full">
        <GiLockSpy size={40} color="white" />
      </div>
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Email is required !!!";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          if (!values.username || values?.username?.length < 3) {
            errors.username = "Username is required and min 3 chars !!!";
          }
          if (!values.password) {
            errors.password = "Password required !!!";
          } else if (
            !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(
              values.password
            )
          ) {
            errors.password =
              "Password should have length min 8 and min one (uppercase, lowercase, number and special character)";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          saveUser(values, setSubmitting);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-2/6 border-2 p-4 bg-gray-50 rounded-md">
            <h2 className="text-red-700 font-bold text-center">
              {errorMessage}
            </h2>
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <Field
                type="username"
                id="username"
                name="username"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Ex: jack mark"
              />
              <ErrorMessage
                name="username"
                component="div"
                style={{ color: "red" }}
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Ex: julielaspace@gmail.com"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              />
              <ErrorMessage
                name="email"
                component="div"
                style={{ color: "red" }}
              />
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              />
              <ErrorMessage
                name="password"
                component="div"
                style={{ color: "red" }}
              />
            </div>
            <div className="flex items-start mb-5">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  defaultValue
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                />
              </div>
              <label
                htmlFor="terms"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                I want it to{" "}
                <a
                  href="#"
                  className="text-primary-light hover:underline dark:text-primary-light"
                >
                  remember me
                </a>
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-white ${isSubmitting ? 'bg-primary-light':'bg-primary-dark'} hover:bg-primary-light focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-dark dark:hover:bg-primary-light dark:focus:ring-primary-light`}
            >
             Create Account
            </button>
            <br />

            <Link
              to={"/login"}
              className="float-right text-primary-light hover:underline dark:text-primary-light"
            >
              Already have an account ? Login
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
}
