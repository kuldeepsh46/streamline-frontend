"use client"

import { useState } from "react";

export default function PasswordEntry({password, setPassword, setErrorMessage}) {

    const [showPassword, setShowPassword] = useState("")

    return(
        <div>
        <div className="font-bold text-[15px] mb-[2px]">
            Password
        </div>
        <div className='flex border rounded-[12px] 
        border-gray-200 pl-[9px] py-[2px] items-center '
        style={{
        }}>
            <input
            value={password}
            placeholder="Password"
            className='w-full outline-none mr-[4px]'
            onChange={(e)=>{setPassword(e.target.value); setErrorMessage("")}}
            type={showPassword?'':"password"}
            />

            {password.length>0 &&
            <div className='font-bold text-[14px] mr-[10px] text-streamlineBlue cursor-pointer'
            onClick={(e)=>{setShowPassword(!showPassword);e.stopPropagation();
            setErrorMessage("")}}>
                {!showPassword? "Show" : "Hide"}
            </div>}

        </div>
        </div>
    )
}