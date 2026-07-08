import { getSupabase, mapWebsite } from '../db.js';

export const getUserProject = {
    path: '/api/my-projects/',
    method: 'post',
    handler: async (req, res) => {
        let { id, pageNum, perPage } = req.body;

        pageNum = +pageNum;
        perPage = +perPage;

        const start = (pageNum * perPage) - perPage;
        const supabase = getSupabase();

        const { data, error } = await supabase
            .from('websites')
            .select('*')
            .eq('author', id)
            .order('created_at', { ascending: false })
            .range(start, start + perPage - 1);

        if (error) {
            return res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
        }

        const result = (data ?? []).map(mapWebsite);
        res.status(200).json({ message: 'Projects Fetched', result });
    },
};
