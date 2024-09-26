import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ onChange, code }) { // Accept onChange prop
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleEditorChange(value, event) {
    if (onChange) {
      onChange(value); // Pass the updated code to the parent component
    }
  }

  return (
    <>
      <Editor
        height="30vh"
        defaultLanguage="javascript"
        defaultValue={ code || `{
  method: function (transactionProcessManager) {
    console.log("Handle the EDIFACT or JSON message content...!");
    let transactionData;
    const currentMessage = transactionProcessManager.transaction.currentMessage;

    // Check if the message contains 'UNH' to determine if it's EDIFACT
    if (currentMessage.includes("UNH")) {
      console.log("Detected EDIFACT format");

      try {
        // Normalize message by removing newline characters and splitting by segment terminator "'"
        const cleanedMessage = currentMessage.replace(/\n/g, "");
        const segments = cleanedMessage.split("'");

        // Initialize variables for messageId, senderId, and receiverId
        let messageId, senderId, receiverId;

        // Loop through each segment and find relevant data
        segments.forEach(segment => {
          const parts = segment.split("+");

          // Extract messageId from UNH segment
          if (parts[0] === "UNH") {
            messageId = parts[1];  // messageId is the second element in UNH
          }

          // Extract senderId from NAD+BY segment (Buyer)
          if (parts[0] === "NAD" && parts[1] === "BY") {
            senderId = parts[2].split(":")[0]; // Extract only the part before ":"
          }

          // Extract receiverId from NAD+SE segment (Seller)
          if (parts[0] === "NAD" && parts[1] === "SE") {
            receiverId = parts[2].split(":")[0]; // Extract only the part before ":"
          }
        });

        // Validate extracted data
        if (messageId && senderId && receiverId) {
          transactionProcessManager.transaction.messageId = messageId;
          transactionProcessManager.transaction.senderId = senderId;
          transactionProcessManager.transaction.receiverId = receiverId;
          transactionProcessManager.transaction.messageType = 'EDIFACT';
          console.log("Extracted IDs: ", { messageId, senderId, receiverId });
          return true;
        } else {
          console.error("Required IDs not found in EDIFACT message");
          return false; // Return false if IDs are not present
        }
      } catch (error) {
        console.error("Failed to process EDIFACT message:", error);
        return false; // Return false if parsing fails
      }

    } else {
      console.log("Detected JSON format");

      // Assume currentMessage is a JSON string; parse it to a JavaScript object
      try {
        transactionData = JSON.parse(currentMessage);
      } catch (error) {
        console.error("Failed to parse currentMessage to JSON:", error);
        return false; // Return false if parsing fails
      }

      // Check if the JSON object has the required properties
      if (transactionData.messageId && transactionData.senderId && transactionData.receiverId) {
        transactionProcessManager.transaction.messageId = transactionData.messageId;
        transactionProcessManager.transaction.senderId = transactionData.senderId;
        transactionProcessManager.transaction.receiverId = transactionData.receiverId;
        transactionProcessManager.transaction.messageType = 'JSON';
        return true;
      } else {
        console.error("Required IDs not found in the JSON object");
        return false; // Return false if IDs are not present in the JSON
      }
    }
  }
}
`}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange} // Handle change events
      />
    </>
  );
}

export default CodeEditor;
