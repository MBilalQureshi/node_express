import { useState } from "react";
import { Typography, Input, Button, Alert } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function SignInForm() {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  const handleSubmit = async (values, { setSubmitting }) => {
    // const storedEmail = localStorage.getItem('email');
    // const storedUsername = localStorage.getItem('username');
    // const storedPassword = localStorage.getItem('password');
    //Use axios to validate the user credentials

    try{
      const response = await axios.post('http://localhost:80/login',{
        usernameEmail: values.email,
        password: values.password
      });
      console.log(response);

      if(response.status === 200){
        console.log('Sign-in successful');
        const {accessToken, refreshToken} = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        navigate('/');
      }
    }catch(err){
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      setSubmitting(false);
    }
    // if (
    //   (values.email === storedEmail || values.email === storedUsername) &&
    //   values.password === storedPassword
    // ) {
    //   // Successful sign-in
    //   console.log("Sign-in successful");
    //   navigate('/');
    // } else {
    //   // Sign-in failed
    //   setShowAlert(true);
    //   setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
    // }

    // setSubmitting(false);
  };

  // Validation schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email or Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  return (
    <section className="grid text-center h-screen items-center p-8">
      <div>
        {showAlert && (
            <Alert color="red" className="mb-4">
              Invalid credentials
            </Alert>
      )}
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Sign In
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          Enter your email and password to sign in
        </Typography>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form action="#" className="mx-auto max-w-[24rem] text-left">
              <div className="mb-6">
                <label htmlFor="email">
                  <Typography
                    variant="small"
                    className="mb-2 block font-medium text-gray-900"
                  >
                    Your Email or Username
                  </Typography>
                </label>
                <Field name="email">
                  {({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="email"
                        color="gray"
                        size="lg"
                        type="text"
                        placeholder="Email or Username"
                        className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                        labelProps={{
                          className: "hidden",
                        }}
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  )}
                </Field>
              </div>

              <div className="mb-6">
                <label htmlFor="password">
                  <Typography
                    variant="small"
                    className="mb-2 block font-medium text-gray-900"
                  >
                    Password
                  </Typography>
                </label>
                <Field name="password">
                  {({ field }) => (
                    <div>
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
                      <ErrorMessage
                        name="password"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  )}
                </Field>
              </div>

              <Button
                color="gray"
                size="lg"
                className="mt-6"
                fullWidth
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>

              <div className="!mt-4 flex justify-end">
                <Typography
                  as="a"
                  href="#"
                  color="blue-gray"
                  variant="small"
                  className="font-medium"
                >
                  Forgot password
                </Typography>
              </div>

              <Button
                variant="outlined"
                size="lg"
                className="mt-6 flex h-12 items-center justify-center gap-2"
                fullWidth
              >
                <img
                  src={`https://www.material-tailwind.com/logos/logo-google.png`}
                  alt="google"
                  className="h-6 w-6"
                />{" "}
                Sign in with Google
              </Button>

              <Typography
                variant="small"
                color="gray"
                className="!mt-4 text-center font-normal"
              >
                Not registered?{" "}
                <a href="#" className="font-medium text-gray-900">
                  Create account
                </a>
              </Typography>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}

export default SignInForm;