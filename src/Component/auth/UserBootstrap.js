import { useEffect, useContext } from 'react';
import { useToken } from './useToken';
import { useUser } from './useUser';
import { userDetailsContext } from '../../Context/contexts';

const getGuestId = () => {
    let guestId = sessionStorage.getItem('guest_id');
    if (!guestId) {
        guestId = crypto.randomUUID();
        sessionStorage.setItem('guest_id', guestId);
    }
    return guestId;
};

export default function UserBootstrap({ children }) {
    const [token] = useToken();
    const userDetailsState = useContext(userDetailsContext);

    useUser();

    useEffect(() => {
        if (token || !userDetailsState) return;

        const guestId = getGuestId();
        const { user, setUserDeatils } = userDetailsState;

        if (user.id === 'guest_id' || user._id === 'guest_id') {
            setUserDeatils({
                ...user,
                id: guestId,
                _id: guestId,
                user: 'guest',
            });
        }
    }, [token, userDetailsState?.user?.id, userDetailsState]);

    return children;
}
