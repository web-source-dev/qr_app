import React from "react";
import { useFormContext } from "./globaldata";

const MyComponent = () => {
  const { handleSubmit } = useFormContext();

  return (
    <form>
      <button onClick={(e) => handleSubmit("Business Text")}>
        Submit
      </button>
      <button onClick={(e) => handleSubmit("Other Text")}>
        Submit Other
      </button>
    </form>
  );
};

export default MyComponent;
