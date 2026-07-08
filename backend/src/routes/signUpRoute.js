import { getSupabase } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUpRoute = {
    path: '/api/signup',
    method: 'post',
    handler: async (req, res) => {
        const { username, email, password } = req.body;
        const supabase = getSupabase();

        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existingUser) {
            res.sendStatus(409);
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                email,
                password_hash: passwordHash,
                username,
                is_email_verified: false,
                api_version: 1,
            })
            .select('id')
            .single();

        if (error) {
            return res.status(500).json({ message: 'Failed to create user', error: error.message });
        }

        const insertedId = newUser.id;

        jwt.sign(
            {
                id: insertedId,
                email,
                username,
                isEmailVerified: false,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.API_LOGIN_PERIOD,
            },
            (err, token) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }

                res.status(200).json({ token });
            },
        );
    },
};
