import { getSupabase } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


/**
 * 
 * NOT DONE
 */
export const createNewWebsite = {
    path: '/api/create-website-page/:id/:project-id',
    method: 'put',
    handler: async (req, res) => {

        //get auth header from client
        const { authorization } = req.headers;
        const { id } = req.params;

        const newWebsiteDom = {
            projectId: null,
            projectDetils: {
                projectAuthor: id
            },
            websiteSetting: {
                siteName: "My Website",
                favIco: "https://reactjs.org/favicon.ico",
                socialImage: "",
                desc: "Description for the webpage"
            },
            published: false,
            pageMode: 1,
            settigMode: -1,
            isDropEnabled: true,
            analyticsID: "",
            dropIndex: 0,
            fonts: [{
                "font": "Poppins",
                "weights": [
                    "300",
                    "regular",
                    "700"
                ]
            }],
            elements: []
        }


        if (!authorization) {
            return res.status(401).json({ message: "No Authorization header sent." })
        }

        // bearer [Token] <=== need this
        const token = authorization.split(" ")[1];

        jwt.verify(
            token,
            process.env.JWT_SECRET,
            async (err, decoded) => {
                if (err) return res.status(401).json({ message: "Unable to verify user" });

                const { id: _id } = decoded;

                console.log(id, _id, decoded);

                if (id !== _id) {
                    return res.status(403).json({ message: "Does not have privilage to create website" });
                }

                const supabase = getSupabase();
                const { error } = await supabase.from('web_pages').insert({
                    project_id: '',
                    project_author: id,
                    page_uri: '/index',
                    page_name: 'Home',
                    website_setting: newWebsiteDom.websiteSetting,
                    published: newWebsiteDom.published,
                    page_mode: newWebsiteDom.pageMode,
                    settig_mode: newWebsiteDom.settigMode,
                    is_drop_enabled: newWebsiteDom.isDropEnabled,
                    analytics_id: newWebsiteDom.analyticsID,
                    drop_index: newWebsiteDom.dropIndex,
                    fonts: newWebsiteDom.fonts,
                    elements: newWebsiteDom.elements,
                });

                if (error) {
                    return res.status(500).json({ message: 'Failed to create website page', error: error.message });
                }

                res.status(200).json({ message: 'Website created' });

            }
        )


    }
}