import { useState } from "react";
import { Typography, Input, Button, Alert, Checkbox } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  const validationSchema = Yup.object({
    username: Yup.string().trim().required("Username is required").min(2, "Username must be at least 2 characters").matches(/.*\S.*/, "Username cannot be just spaces"),
    name: Yup.string().trim().required("Name is required").min(2, "Name must be at least 2 characters").matches(/.*\S.*/, "Name cannot be just spaces"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    age: Yup.number()
    .nullable()
    .min(1, "Age must be at least 1")
    .max(100, "Age must be at most 100"),
    gender: Yup.string().required("Gender is required").oneOf(["male", "female", "other"], "Invalid gender"),
    agreeToTerms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:80/create/user', values);

      if (response.status === 201) {
        console.log('Sign-up successful');
        const { accessToken, refreshToken } = response.data;
        // Store tokens in localStorage or cookies
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        navigate('/');
      }
    } catch (err) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setSubmitting(false);
    }
  };

  return (
    <section className="grid text-center h-screen items-center p-8">
      <div>
        {showAlert && (
            <Alert color="red" className="mb-4">
              Invalid credentials
            </Alert>
      )}
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Sign Up
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          Enter your details to sign up
        </Typography>
        <Formik
          initialValues={{ username: '', name: '', email: '', password: '', age: '', gender: '', agreeToTerms: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form action="#" className="mx-auto max-w-[24rem] text-left">
              <div className="mb-4">
                <Field name="username" type="text" as={Input} label="Username" />
                <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <Field name="name" type="text" as={Input} label="Name" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <Field name="email" type="email" as={Input} label="Email" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4 relative">
                <Field name="password">
                  {({ field }) => (
                    <Input
                      {...field}
                      size="lg"
                      placeholder="********"
                      labelProps={{
                        className: "hidden",
                      }}
                      className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                      type={passwordShown ? "text" : "password"}
                      icon={
                        <i onClick={togglePasswordVisibility}>
                          {passwordShown ? (
                            <EyeIcon className="h-5 w-5" />
                          ) : (
                            <EyeSlashIcon className="h-5 w-5" />
                          )}
                        </i>
                      }
                    />
                  )}
                </Field>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <Field name="age" type="number" as={Input} label="Age" />
                <ErrorMessage name="age" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <Field name="gender" as="select" className="form-select">
                  <option value="" label="Select gender" />
                  <option value="male" label="Male" />
                  <option value="female" label="Female" />
                  <option value="other" label="Other" />
                </Field>
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <Field name="agreeToTerms">
                  {({ field }) => (
                    <Checkbox
                      {...field}
                      label={
                        <Typography
                          variant="small"
                          color="gray"
                          className="flex items-center font-normal"
                        >
                          I agree to the
                          <a href="#" className="font-medium transition-colors hover:text-gray-900">
                            &nbsp;Terms and Conditions
                          </a>
                        </Typography>
                      }
                      containerProps={{ className: "-ml-2.5" }}
                      onChange={(e) => setFieldValue('agreeToTerms', e.target.checked)}
                    />
                  )}
                </Field>
                <ErrorMessage name="agreeToTerms" component="p" className="text-red-500 text-sm" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">Sign Up</Button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}

export default SignUpForm;