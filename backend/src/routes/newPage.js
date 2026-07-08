import { getSupabase } from '../db.js';

export const newPage = {
    path: '/api/new-webpage/',
    method: 'put',
    handler: async (req, res) => {
        const { id, pageName, pageUri, webId } = req.body;
        const supabase = getSupabase();
        const normalizedUri = `/${pageUri.toLowerCase()}`;

        const { count, error: countError } = await supabase
            .from('web_pages')
            .select('*', { count: 'exact', head: true })
            .eq('project_author', id)
            .eq('project_id', webId)
            .eq('page_uri', normalizedUri);

        if (countError) {
            return res.status(500).json({ message: 'Failed to check existing pages', error: countError.message });
        }

        if (count > 0) {
            return res.status(409).json({ message: 'Page on same uri already exist' });
        }

        const indexPage = {
            project_id: webId,
            page_uri: normalizedUri,
            page_name: pageName,
            project_author: id,
            website_setting: {
                siteName: pageName,
                favIco: 'https://reactjs.org/favicon.ico',
                socialImage: '',
                desc: `This is a ${pageName}`,
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
            .select('pages')
            .eq('id', webId)
            .single();

        if (websiteError) {
            return res.status(500).json({ message: 'Failed to update website', error: websiteError.message });
        }

        const updatedPages = [...(websiteData.pages ?? []), { pageId, pageName }];

        const { error: updateError } = await supabase
            .from('websites')
            .update({ pages: updatedPages })
            .eq('id', webId);

        if (updateError) {
            return res.status(500).json({ message: 'Failed to update website pages', error: updateError.message });
        }

        res.status(200).json({ message: 'WebPage created', pageId, webId });
    },
};
