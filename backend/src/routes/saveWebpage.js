import { getSupabase, webPageToRow } from '../db.js';

export const saveWebPage = {
    path: '/api/save-webpage/',
    method: 'post',
    handler: async (req, res) => {
        const { pageId, pageJso } = req.body;
        const supabase = getSupabase();

        const { error } = await supabase
            .from('web_pages')
            .update(webPageToRow(pageJso))
            .eq('id', pageId);

        if (error) {
            return res.status(500).json({ message: 'Failed to save webpage', error: error.message });
        }

        res.status(200).json({ message: 'Website updated' });
    },
};
