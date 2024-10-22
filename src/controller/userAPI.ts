import { Hono } from "hono";
import { Env } from "../types/env";
import { checkOriginAdmin, errorCors } from "../cors";
import { ApiResponse } from "../types/apiResponse";
import { GetUser, newUser, User, updateUser } from "../repository/userRepo";
import { errorMsg } from "../utils/utils";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import Security from "../utils/security";

const userAPI = (app: Hono, db: Env) => {

	const CRYPTO_KEY = db.CRYPTO_KEY
	app.post('/auth', async (c) => {
		if (!checkOriginAdmin(c, db)) return errorCors(c);

		const { encryptedDataString } = await c.req.json()

		const security = new Security()
		const decrypted_data = security.decrypt(CRYPTO_KEY, encryptedDataString)

		if (decrypted_data) {
			const jsonObject = JSON.parse(decrypted_data)
			const { username, password }: newUser = jsonObject
			try {
				const { data, status }: ApiResponse<User> = await GetUser(db, username)

				if (password === data.password) return c.json({ error: 'Invalid credentials' }, 401)

				await setSignedCookie(c, 'session', username, db.SECRET_KEY, {
					path: '/',
					secure: true,
					domain: 'animalhada.com',
					httpOnly: true,
					maxAge: 3600 * 24 * 30,
					expires: new Date(new Date().getTime() + 3600 * 24 * 30 * 1000),
			})
			return c.json({ message: 'Authenticated ' }, status)
		} catch (error) {
			return errorMsg(c, error)
		}
	}
	})
	app.post('/auth/check', async (c) => {
		if (!checkOriginAdmin(c, db)) return errorCors(c);

		const sessionCookie = await getSignedCookie(c, db.SECRET_KEY, 'session');

		if (!sessionCookie) {
			return c.json({ error: 'No valid session' }, 401);
		}
		try {
			const { data, status }: ApiResponse<User> = await GetUser(db, sessionCookie)
			return c.json({ message: 'Valid session', username: sessionCookie }, status);
		} catch (error) {
			return errorMsg(c, error)
		 }
	});
	app.post('/auth/signout', async(c) => {
		if (!checkOriginAdmin(c, db)) return errorCors(c);
		try {
			deleteCookie(c, 'session', {
				path: '/',
				secure: true,
				domain: 'animalhada.com',
			})
			return c.json({ message: 'Signed out'}, 200)
		} catch(error){
			return errorMsg(c, error)
		}

	})
}

export default userAPI;
