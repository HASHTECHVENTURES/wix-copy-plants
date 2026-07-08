import { getSupabase, mapWebPage } from '../db.js';

export const pubWebPage = {
    path: '/api/PublishPage/',
    method: 'post',
    handler: async (req, res) => {
        const { pageUri, websiteId } = req.body;

        try {
            const supabase = getSupabase();

            const { data, error } = await supabase
                .from('web_pages')
                .select('*')
                .eq('page_uri', `/${pageUri}`)
                .eq('project_id', websiteId)
                .eq('published', true)
                .single();

            if (error) {
                return res.status(500).json({ message: 'Something went wrong' });
            }

            res.status(200).json({ message: 'WebPage Fetched', result: mapWebPage(data) });
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    },
};
