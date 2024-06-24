import React, { FormEvent, FormEventHandler, useEffect, useRef, useState } from "react";
import * as SimpleWebAuthnBrowser from "@simplewebauthn/browser";
import { useAuth } from "@/AuthProvider";
import { useRouter } from "next/router";
function Login() {
	const { handleDeviceAuthentication, login, user } = useAuth();
	const [email, setEmail] = useState("");
	const router = useRouter();
	const passwordRef = useRef<HTMLInputElement>(null);
	const [browserSupportsWebAuthn, setBrowserSupportsWebAuthn] = useState(false);

	const e = email;
	useEffect(() => {
		if (SimpleWebAuthnBrowser.browserSupportsWebAuthn()) {
			setBrowserSupportsWebAuthn(true);
			handleDeviceAuthentication(email as string, true).then(
				(isSuccessful) => isSuccessful && router.replace("profile"),
			);
		}
	}, [e]);

	const goToProfilePage = (isSuccessful: boolean) => isSuccessful && router.replace("profile");
	const handleLoginPasskey: FormEventHandler<HTMLFormElement> = (e: FormEvent) => {
		e.preventDefault();
		return handleDeviceAuthentication(email).then(goToProfilePage);
	};

	const handleLoginBasic: FormEventHandler<HTMLFormElement> = (e: FormEvent) => {
		e.preventDefault();
		if (passwordRef?.current && email) {
			const password = passwordRef.current?.value || "";
			return login(email, password).then(goToProfilePage);
		}
	};

	return (
		<form onSubmit={browserSupportsWebAuthn ? handleLoginPasskey : handleLoginBasic}>
			<div className='grid_txt_1'>
				<h1 className='u-center'>&lt;Login&gt;</h1>
				<div className='grid_txt'>
					<label htmlFor=''>email</label>
					<input
						value={email}
						// name='email'
						placeholder='enter your email'
						autoComplete='username'
						onChange={({ target: { value } }) => setEmail(value)}
					/>
				</div>
				{browserSupportsWebAuthn ? (
					<></>
				) : (
					<>
						<div className='grid_txt'>
							<label htmlFor=''>password</label>
							<input
								ref={passwordRef}
								type='password'
								placeholder='enter your password'
								autoComplete='password webauthn'
							/>
						</div>
					</>
				)}
				<button className='btn flexi'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						version='1.0'
						width='20.000000pt'
						height='20.000000pt'
						viewBox='0 0 500.000000 500.000000'
						preserveAspectRatio='xMidYMid meet'
					>
						<g
							transform='translate(0.000000,500.000000) scale(0.100000,-0.100000)'
							fill='#fff'
							stroke='none'
						>
							<path d='M1990 4666 c-341 -71 -626 -350 -713 -696 -30 -120 -30 -320 0 -440 88 -351 371 -624 721 -696 57 -12 113 -15 227 -12 128 5 162 9 235 33 202 65 352 169 470 327 75 99 121 190 157 305 25 81 27 101 27 263 0 162 -2 182 -27 263 -95 308 -316 531 -627 632 -76 25 -102 28 -245 31 -107 2 -181 -1 -225 -10z' />
							<path d='M3810 3526 c-143 -30 -268 -100 -375 -211 -198 -203 -258 -512 -150 -777 55 -136 179 -278 303 -348 l61 -35 1 -560 0 -560 153 -152 153 -153 259 260 260 260 -155 155 -155 155 153 153 c83 84 152 157 152 162 0 5 -55 65 -122 132 -67 67 -120 124 -118 126 3 2 41 23 85 48 166 92 299 264 345 445 24 94 27 269 5 359 -59 252 -263 461 -517 531 -77 21 -259 26 -338 10z m263 -332 c49 -34 97 -119 97 -173 0 -51 -42 -134 -83 -165 -46 -35 -129 -52 -182 -38 -86 24 -154 112 -155 200 -1 166 188 269 323 176z' />
							<path d='M1685 2484 c-462 -71 -850 -401 -996 -847 -50 -154 -59 -232 -59 -528 l0 -269 1350 0 1350 0 0 570 0 570 -80 76 c-90 86 -161 178 -212 274 l-34 65 -110 37 c-179 60 -264 68 -720 67 -285 -1 -425 -5 -489 -15z' />
						</g>
						<div id='divScriptsUsed' style={{ display: "none" }} />
					</svg>
					<span>continue with passkey</span>
				</button>
			</div>
		</form>
	);
}

export default Login;
