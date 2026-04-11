"use client";

// Modal.js
import React from 'react'
import XCancelIcon from '../../public/XCancelIcon.svg'

import { useState } from 'react';
import PaymentPage from '../hooks/stripeHooks/checkout_sessions';

const PaymentModal = ({ isOpen, onClose, isModal,lessonPrice,currency}) => {

  if (!isOpen && isModal) return null

  return (
    <div className={isModal? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" 
    : "flex items-center justify-center"}>
      <div className=
      {isModal?"relative flex flex-col bg-white p-6 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] w-96 items-center":
      "flex flex-col w-full bg-white p-6 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] items-center"}>
        
        {isModal &&
        <button 
        className=" absolute right-[15px] top-[10px] text-streamlineBlue font-bold float-right" 
        onClick={
            ()=>{onClose(); setErrorMessage("")}}>
        <XCancelIcon className="w-[25px] h-[50px]"/>
        </button>}

        <PaymentPage amount={lessonPrice} currency={currency}/>

      </div>
    </div>
  )
}

export default PaymentModal