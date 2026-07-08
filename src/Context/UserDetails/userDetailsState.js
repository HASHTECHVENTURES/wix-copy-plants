import { useState } from "react";
import { userDetailsContext } from "../contexts";

const UserDetailsState = (props) => {

    const initialUserDetails = {
        user: "guest",
        email: "guest@example.com",
        _id: "guest_id",
        pageId: "",
        websiteId: "",
        id: "guest_id"
    }


    const [user, setUserDeatils] = useState(initialUserDetails)
    const [editorState, setEditorState] = useState({})

    return (
        <userDetailsContext.Provider value={{ user, setUserDeatils, editorState, setEditorState }}>
            {props.children}
        </userDetailsContext.Provider>
    )
}


export default UserDetailsState;
