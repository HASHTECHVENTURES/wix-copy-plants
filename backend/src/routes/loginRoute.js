import { getSupabase, mapUser } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginRoute = {
    path: '/api/login',
    method: 'post',
    handler: async (req, res) => {
        const { email, password } = req.body;
        const supabase = getSupabase();

        const { data: userRow, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error || !userRow) {
            res.sendStatus(401);
            return;
        }

        const user = mapUser(userRow);
        const { _id: id, isEmailVerified, passwordHash, apiVersion, username } = user;

        const isCorrect = await bcrypt.compare(password, passwordHash);

        if (isCorrect) {
            jwt.sign(
                {
                    id,
                    isEmailVerified,
                    email,
                    username,
                    apiVersion,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.API_LOGIN_PERIOD,
                },
                (err, token) => {
                    if (err) {
                        res.status(500).json(err);
                        return;
                    }

                    res.status(200).json({ token });
                },
            );
        } else {
            res.sendStatus(401);
        }
    },
};
