import { getSupabase, mapWebsite, mapWebPage } from '../db.js';

export const getWebPage = {
    path: '/api/getWebPage/',
    method: 'post',
    handler: async (req, res) => {
        const { pageId, websiteId } = req.body;

        try {
            const supabase = getSupabase();

            const { data: pageData, error: pageError } = await supabase
                .from('web_pages')
                .select('*')
                .eq('id', pageId)
                .single();

            if (pageError) {
                return res.status(500).json({ message: 'Something went wrong' });
            }

            const { data: websiteData, error: websiteError } = await supabase
                .from('websites')
                .select('*')
                .eq('id', websiteId)
                .single();

            if (websiteError) {
                return res.status(500).json({ message: 'Something went wrong' });
            }

            res.status(200).json({
                message: 'WebPage Fetched',
                result: mapWebPage(pageData),
                webResult: mapWebsite(websiteData),
            });
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    },
};
