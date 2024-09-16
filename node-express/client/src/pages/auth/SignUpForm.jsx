import React from 'react';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

function SignUpForm() {
  // to redirect to another page
  const navigate = useNavigate();
  // Define Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().trim().required("Name is required").min(2, "Name must be at least 2 characters").matches(/.*\S.*/, "Name cannot be just spaces"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    agreeToTerms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
  });
  const handleSubmit = (values, { setSubmitting }) => {
    localStorage.setItem('username', values.name);
    localStorage.setItem('email', values.email);
    localStorage.setItem('password', values.password);
    localStorage.setItem('agreeToTerms', values.agreeToTerms);

    // Simulate submitting to a backend server and route to sign-in
    setTimeout(() => {
      setSubmitting(false);
      navigate('/signin');
    }, 400);
  }
  return (
    <div className='flex justify-center items-center'>
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to register.
        </Typography>

        <Formik
          initialValues={{ name: '', email: '', password: '', agreeToTerms: false }}
          validationSchema={validationSchema}
          // onSubmit={(values) => {
          //   console.log('Form data:', values);
          // }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
              <div className="mb-1 flex flex-col gap-6">
                {/* Name Field */}
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Your Name
                </Typography>
                <Field name="name">
                  {({ field }) => (
                    <div>
                      <Input
                        {...field}
                        size="lg"
                        placeholder="Name"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{ className: "before:content-none after:content-none" }}
                      />
                      <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                    </div>
                  )}
                </Field>

                {/* Email Field */}
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Your Email
                </Typography>
                <Field name="email">
                  {({ field }) => (
                    <div>
                      <Input
                        {...field}
                        size="lg"
                        placeholder="name@mail.com"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{ className: "before:content-none after:content-none" }}
                      />
                      <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                    </div>
                  )}
                </Field>

                {/* Password Field */}
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Password
                </Typography>
                <Field name="password">
                  {({ field }) => (
                    <div>
                      <Input
                        {...field}
                        type="password"
                        size="lg"
                        placeholder="********"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{ className: "before:content-none after:content-none" }}
                      />
                      <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
                    </div>
                  )}
                </Field>
              </div>

              {/* Checkbox Field */}
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

              <Button className="mt-6" fullWidth type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </Button>

              <Typography color="gray" className="mt-4 text-center font-normal">
                Already have an account?{' '}
                <a href="#" className="font-medium text-gray-900">
                  Sign In
                </a>
              </Typography>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}

export default SignUpForm;
