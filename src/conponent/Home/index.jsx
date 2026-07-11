import React,{useState,useEffect} from 'react'

export default function Home() {
  const [str,setStr] = useState([1,2,3])
  setTimeout(()=>{
    str[2]=5
    console.log(5);
  },3000)
  
  
  return (
    <div>{str.toString()}</div>
  )
}
