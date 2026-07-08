import { getSupabase } from '../db.js';

export const createWebsite = {
    path: '/api/create-website/:id',
    method: 'put',
    handler: async (req, res) => {
        const { id } = req.params;
        const supabase = getSupabase();

        const indexPage = {
            project_id: '',
            page_uri: '/index',
            page_name: 'Home',
            project_author: id,
            website_setting: {
                siteName: 'My Website',
                favIco: 'https://reactjs.org/favicon.ico',
                socialImage: '',
                desc: 'Description for the webpage',
            },
            published: false,
            page_mode: 1,
            settig_mode: -1,
            is_drop_enabled: true,
            analytics_id: '',
            drop_index: 0,
            fonts: [{
                font: 'Poppins',
                weights: ['300', 'regular', '700'],
            }],
            elements: [],
        };

        const { data: pageData, error: pageError } = await supabase
            .from('web_pages')
            .insert(indexPage)
            .select('id')
            .single();

        if (pageError) {
            return res.status(500).json({ message: 'Failed to create page', error: pageError.message });
        }

        const pageId = pageData.id;

        const { data: websiteData, error: websiteError } = await supabase
            .from('websites')
            .insert({
                author: id,
                website_name: req.body.websiteName,
                prev_img_uri: '',
                published: false,
                pages: [{ pageName: 'Home', pageId }],
            })
            .select('id')
            .single();

        if (websiteError) {
            return res.status(500).json({ message: 'Failed to create website', error: websiteError.message });
        }

        const webId = websiteData.id;

        const { error: updateError } = await supabase
            .from('web_pages')
            .update({ project_id: webId })
            .eq('id', pageId)
            .eq('project_author', id);

        if (updateError) {
            return res.status(500).json({ message: 'Failed to link page to website', error: updateError.message });
        }

        res.status(200).json({ message: 'Website created', pageId, webId });
    },
};
