import React from 'react'
import { useNavigate } from "react-router-dom";

export default function Goback() {

   const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
    navigate(-1);
  } else {
    alert("No page to go back!");
  }
  };

  return (
    <button id="goBack" onClick={goBack}> ← </button>
  )
}
