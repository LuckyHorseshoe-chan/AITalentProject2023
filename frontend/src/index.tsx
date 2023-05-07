import React from "react";
import { render } from 'react-dom';
import { ChakraProvider } from "@chakra-ui/react";

import Prediction from "./components/Prediction";
import Generation from "./components/Generation";
import Visualization from "./components/Visualization";

function App() {
  return (
    <ChakraProvider>
      <Prediction />
      <Generation />
    </ChakraProvider>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
