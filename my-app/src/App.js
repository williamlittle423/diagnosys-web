import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import aiInstructions from './instructions';

const { createAssistant, createThread, getChatResponse } = require('./openai-toolkit');
// App.js

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [assistant, setAssistant] = useState(null);
  const [thread, setThread] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null); // Add this line
  const [startDiagnosis, setStartDiagnosis] = useState(false);
  const [testState, setTestState] = useState("Diagnosis in progress");
  // Define gradientStyle
  
  const gradientStyle = {
    background: 'linear-gradient(to right, #081F2F, #0E4648, #081F2F)',
  };


  // Define handleExitClick
  const handleExitClick = () => {
    setAssistant(assistant);
    setThread(thread);
    setMessages(["Patient: Hello doctor."])
    setStartDiagnosis(false);
    setTestState("Diagnosis in progress");
  };

  // Define handleStartClick
  const handleStartClick = () => {
    setStartDiagnosis(true);
  };

  useEffect(() => {
    if (isThinking) {
      setTestState("Patient is thinking...");
    } else {
      setTestState("patient is waiting for a responce");
    }
  }, [isThinking]);


  useEffect(() => {
    const init = async () => {
      let instructions = aiInstructions;
      const assistant = await createAssistant(instructions=instructions);
      const thread = await createThread();
      setAssistant(assistant);
      setThread(thread);
      setMessages(["Patient: Hello doctor."])
    };
    init();
  }, []);


  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
    setIsThinking(true); // Set isThinking to true
    const submittedInput = input; // Store the value of input
    setInput(''); // Clear input
    setMessages([...messages, `\nYou: ${submittedInput}`]); // Update messages with user's input
    const response = await getChatResponse(assistant, thread, submittedInput); // Use submittedInput instead of input
    setMessages(prevMessages => [...prevMessages, `\nPatient: ${response}`]); // Update messages with AI's response
    setIsThinking(false); // Set isThinking back to false
  };


  if (startDiagnosis) {
    return (
      <div style={gradientStyle} className="flex flex-col h-screen text-white">
        {/* Header with centered text and exit button */}
        <div className="flex justify-between items-center w-full p-4">
          <div className="w-40" /> {/* Invisible spacer to balance the exit button */}
          <span className="text-center font-Raleway font-light text-xl mt-4">{testState}</span>
          <button onClick={handleExitClick} className="font-Raleway text-xl mt-4 mr-4">
            Exit diagnosis ✖
          </button>
        </div>
        
        {/* Main content */}
        <div className="flex-grow flex flex-col items-center justify-center space-y-4 p-4">
          {/* Chat messages */}
          <div className="h-[60vh] w-[40vw] bg-white text-black overflow-auto p-4 rounded-xl mb-4 flex flex-col">
            {messages.map((message, index) => (
              <div key={index} className="whitespace-pre-line">{message}</div>
            ))}
          </div>
          {/* Flex container for microphone and input */}
          <div className="flex items-center space-x-4">

            {/* Input field */}
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
              {/* Microphone icon */}
              <button type="button" className="text-xl mb-6">🎤</button>
              <input
                type="text"
                placeholder="Ask a question..."
                className="w-full mx-4 px-2 py-2 rounded-xl text-md mb-6 font-Raleway text-white"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onChange={handleInputChange}
                value={input}
                disabled={isThinking} // Disable input field while AI is thinking
              />

              {/* Prevent form from being submitted if input is empty */}
              <button type="submit" style={{ display: 'none' }} />
            </form> 
          </div>

          {/* Finish conversation button */}
          <button
            className="bg-[#15C99B] text-[#0A2735] font-Raleway font-bold text-lg py-4 px-8 rounded-xl hover:bg-teal-700 transition-colors duration-300"
          >
            Finish Conversation
          </button>
        </div>
      </div>
    );
  }
  else {
    return (
      <div style={gradientStyle} className="flex flex-col h-screen text-white p-4">
        {/* Header at the top but centered horizontally /}
        <header className="flex justify-center items-center w-full py-4">
          <h1 className="font-Raleway text-2xl font-bold">
            DiagnoSys
          </h1>
        </header>

        {/ Rest of the content centered vertically and horizontally */}
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <p className="font-Raleway mb-12 text-2xl">
            Diagnose with Precision: Engage with Lifelike AI Patients
            <br />
            and Gain In-depth Feedback for Expert Training.
          </p>
          <button
          onClick={handleStartClick}
          className="font-Raleway text-[#0A2735] font-bold text-lg py-4 px-8 rounded-xl hover:bg-teal-700 transition-colors duration-300"
          style={{ backgroundColor: '#15C99B' }}
        >
          Begin patient diagnosis
        </button>
        </div>
      </div>
    );
  }
}
export default App;
