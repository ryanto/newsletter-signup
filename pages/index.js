import { useState } from "react";

export default function Home() {
  let { isSubmitting, isComplete, error, formProps } = useCovertKitForm({
    // this is the framer motion course form id
    formId: "3179275",
  });

  // You can use the following to build this form.
  //  isSubmitting - the form is submitting
  //  isComplete - the user is all signed up
  //  error - There was an error. invalidEmail | noEmail | serverError

  return isComplete ? (
    <p>Thank you for signing up!</p>
  ) : (
    <form {...formProps}>
      {/* input name must be email_address */}
      <input
        type="email"
        required
        name="email_address"
        disabled={isSubmitting}
        placeholder="Enter your email"
      />
      <button type="submit" disabled={isSubmitting}>
        Sign up!
      </button>
      {error && (
        <div>
          {error === "serverError" &&
            "Woops — something's wrong with our signup form 😔. Please try again."}
          {error === "invalidEmail" &&
            "Oops — that's an invalid email address!"}
          {error === "noEmail" && "Please fill out your email address!"}
        </div>
      )}
    </form>
  );
}

function useCovertKitForm({ formId }) {
  let url = `https://app.convertkit.com/forms/${formId}/subscriptions`;
  let [error, setError] = useState("");
  let [formState, setFormState] = useState("");

  let isSubmitting = formState === "submitting";
  let isComplete = formState === "complete";

  function handleChange(event) {
    if (event.target?.name === "email_address") {
      let input = event.target;
      let email = input.value;

      if (error && error === "invalidEmail" && isEmailValid(email)) {
        setError("");
      }
    }
  }

  let handleSubmit = async function (event) {
    event.preventDefault();
    let form = event.target;
    let email = form.email_address.value;

    if (!email) {
      setError("noEmail");
    } else if (!isEmailValid(email)) {
      setError("invalidEmail");
    } else {
      setFormState("submitting");

      let formData = new FormData(form);

      try {
        let response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          setFormState("complete");
        } else {
          setError("serverError");
        }
      } catch (e) {
        console.error(e);
        setError("serverError");
      }
    }
  };

  let formProps = {
    onChange: handleChange,
    onSubmit: handleSubmit,
    method: "POST",
    action: url,
  };

  return {
    error,
    formProps,
    isComplete,
    isSubmitting,
  };
}

let isEmailValid = function (email) {
  // eslint-disable-next-line
  let re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
