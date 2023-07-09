import React from 'react'
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import verified from '../assets/verified.gif'
import styled from "styled-components";
import error from '../assets/error.gif'

const EmailVerification = () => {
	const [validUrl, setValidUrl] = useState(true);
	const { id, token } = useParams();
  
	useEffect(() => {
	  const verifyEmailUrl = async () => {
		try {
		  const url = `http://localhost:5000/api/auth/${id}/verify/${token}`;
		  const { data } = await axios.get(url);
		  console.log(data);
		  if (data.status === true) {
			setValidUrl(true);
		  } else {
			setValidUrl(false);
		  }
		} catch (error) {
		  console.log(error);
		  setValidUrl(false);
		}
	  };
  
	  verifyEmailUrl();
	}, []);

    if(validUrl){
        return(
            <Container>
            <div >
				<img src={verified} alt="success_img" />
				<h1>Email verified successfully</h1>
				<div className='buttons'>
					<Link to="/login">
						<button className='button'>Login</button>
					</Link>
				</div>
				
			</div>
            </Container >
        )
    }else{
        return(
            <Container>
			<div >
				<img src={error} alt="success_img" />
			</div>
                <h1>404 Not Found. The Link is Invalid.</h1>
				<div className='buttons'>
					<Link to="/login">
						<button className='button'>Login</button>
					</Link>
					<Link to="/register">
						<button className='button'>Register</button>
					</Link>
				</div>
            </Container>
        )
    }
}
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  h1{
	color: #FDF4F5;
  }
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
  .button {
  appearance: none;
  backface-visibility: hidden;
  align-items: center;
  background-color: #2f80ed;
  border-radius: 10px;
  border-style: none;
  justify-content: center;
  box-shadow: none;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 15px;
  font-weight: 500;
  height: 50px;
  letter-spacing: normal;
  line-height: 1.5;
  outline: none;
  overflow: hidden;
  padding: 14px 30px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transform: translate3d(0, 0, 0);
  transition: all .3s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: top;
  white-space: nowrap;
}
@media (min-width: 768px) {
  .button {
    padding: 14px 22px;
    width: 176px;
  }
}.buttons{
	display: grid;
    margin-left: auto;
    margin-right: auto;
	justify-content: center;
  	align-items: center;
	grid-template-columns: auto auto;
	gap: 2rem;
}
`;

export default EmailVerification

