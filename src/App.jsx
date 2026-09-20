
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z
  .object({
    firstName: z.string().trim().min(2, "First name must contain at least 2 characters"),
    lastName: z.string().trim().min(2, "Last name must contain at least 2 characters"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must contain at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function App() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
    reset,
  } = methods;

  const formData = watch();

  const stepFields = {
    1: ["firstName", "lastName", "dateOfBirth"],
    2: ["email", "password", "confirmPassword"],
  };

  const isStepValid = () => {
    if (step === 1) {
      return (
        formData.firstName?.trim().length >= 2 &&
        formData.lastName?.trim().length >= 2 &&
        Boolean(formData.dateOfBirth) &&
        !errors.firstName &&
        !errors.lastName &&
        !errors.dateOfBirth
      );
    }

    if (step === 2) {
      return (
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || "") &&
        (formData.password || "").length >= 8 &&
        (formData.confirmPassword || "").length > 0 &&
        formData.password === formData.confirmPassword &&
        !errors.email &&
        !errors.password &&
        !errors.confirmPassword
      );
    }

    return true;
  };

  const nextStep = async () => {
    const isValid = await trigger(stepFields[step]);

    if (isValid) {
      setStep((currentStep) => currentStep + 1);
    }
  };

  const previousStep = () => {
    setStep((currentStep) => currentStep - 1);
  };

  const onSubmit = (data) => {
    console.log("Final Registration Data:", data);
    setSubmitted(true);
  };

  const startAgain = () => {
    reset();
    setStep(1);
    setSubmitted(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  if (submitted) {
    return (
      <main className="app-container">
        <section className="success-card">
          <div className="success-icon">✓</div>

          <h1>Registration Successful!</h1>

          <p>
            Your registration details have been submitted successfully.
          </p>

          <button onClick={startAgain}>
            Register Another Account
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-container">
      <section className="wizard-card">
        <header className="wizard-header">
          <p className="eyebrow">CREATE YOUR ACCOUNT</p>

          <h1>Registration Wizard</h1>

          <p>Complete all three steps to register your account.</p>
        </header>

        <div className="progress-section">
          <div className="progress-info">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}%</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {step === 1 && (
              <section className="form-step">
                <h2>Personal Information</h2>

                <p className="step-description">
                  Enter your personal details.
                </p>

                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>

                  <input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    {...register("firstName")}
                  />

                  <p className="error-message">
                    {errors.firstName?.message}
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>

                  <input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    {...register("lastName")}
                  />

                  <p className="error-message">
                    {errors.lastName?.message}
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>

                  <input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                  />

                  <p className="error-message">
                    {errors.dateOfBirth?.message}
                  </p>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="form-step">
                <h2>Account Details</h2>

                <p className="step-description">
                  Create secure login credentials.
                </p>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                  />

                  <p className="error-message">
                    {errors.email?.message}
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>

                  <div className="password-wrapper">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      {...register("password")}
                    />

                    <button
                      type="button"
                      className="visibility-button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <p className="error-message">
                    {errors.password?.message}
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm Password
                  </label>

                  <div className="password-wrapper">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      {...register("confirmPassword")}
                    />

                    <button
                      type="button"
                      className="visibility-button"
                      onClick={() =>
                        setShowConfirmPassword((visible) => !visible)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <p className="error-message">
                    {errors.confirmPassword?.message}
                  </p>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="form-step">
                <h2>Review & Submit</h2>

                <p className="step-description">
                  Review your information before submitting.
                </p>

                <div className="review-box">
                  <p>
                    <strong>First Name:</strong> {formData.firstName}
                  </p>

                  <p>
                    <strong>Last Name:</strong> {formData.lastName}
                  </p>

                  <p>
                    <strong>Date of Birth:</strong> {formData.dateOfBirth}
                  </p>

                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>

                  <p>
                    <strong>Password:</strong> ••••••••
                  </p>
                </div>
              </section>
            )}

            <div className="button-group">
              {step > 1 && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={previousStep}
                >
                  Back
                </button>
              )}

              {step < 3 && (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="next-button"
                >
                  Next
                </button>
              )}

              {step === 3 && (
                <button type="submit">
                  Submit Registration
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </section>
    </main>
  );
}

export default App;