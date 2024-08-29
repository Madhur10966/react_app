import React, { useState } from "react";
import { object, string, number } from "yup";
//import "./FormComponent.css";

const userInfoSchema = object({
  firstName: string().required("First Name is required"),
  lastName: string().required("Last Name is required"),
  age: number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Age is required")
    .positive("Age must be positive")
    .integer("Age must be an integer"),
  gender: string()
    .transform((value) => (!value.length ? undefined : value))
    .required("Gender is required")
    .test(
      "isGender",
      "Invalid gender",
      (value) =>
        value.toLowerCase() === "male" || value.toLowerCase() === "female"
    ),
  email: string().required().email("Invalid email format"),
  phone: number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Mobile no. is required")
    .test(
      "isPhone",
      "Invalid phone number",
      (value) => value && value.toString().length === 10
    ),
  password: string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password cannot exceed 16 characters"),
});

export const FormComponent = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);

  const handleFormChange = (event) => {
    const { id, value, type } = event.target;
    const newValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;
    setUserInfo((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();

    try {
      await userInfoSchema.validate(userInfo, { abortEarly: false });
      setErrors({});
      setSubmissionResult(userInfo);
    } catch (error) {
      if (error.inner) {
        const newErrors = error.inner.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        setErrors(newErrors);
      }
      setSubmissionResult(null);
    }
  };

  return (
    <>
      <div className="form-root-div" style={{ paddingLeft: "500px" }}>
        <form onSubmit={submitForm}>
          <div className="formHeader">
            <h2>Sign up</h2>
          </div>
          <div className="name">
            <div className="firstName">
              <label htmlFor="firstName">First Name :</label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                onChange={handleFormChange}
                value={userInfo.firstName}
              />
              {errors.firstName && (
                <div className="error">{errors.firstName}</div>
              )}
            </div>
            <div className="lastName">
              <label htmlFor="lastName">Last Name :</label>
              <input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                onChange={handleFormChange}
                value={userInfo.lastName}
              />
              {errors.lastName && (
                <div className="error">{errors.lastName}</div>
              )}
            </div>
          </div>
        
          <div className="contact">
            <div className="email">
              <label htmlFor="email">Email :</label>
              <input
                id="email"
                type="text"
                placeholder="Enter your email"
                onChange={handleFormChange}
                value={userInfo.email}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="phone">
              <label htmlFor="phone">Mobile No. :</label>
              <input
                id="phone"
                type="number"
                placeholder="Enter your mobile no."
                onChange={handleFormChange}
                value={userInfo.phone}
              />
              {errors.phone && <div className="error">{errors.phone}</div>}
            </div>
          </div>
          <div className="password">
            <label htmlFor="password">Password :</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleFormChange}
              value={userInfo.password}
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {submissionResult && (
        <div className="submission-root-div">
          <div className="submission-result">
            <h2>Form Submitted Successfully!</h2>
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(submissionResult).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                    <td>{value.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
