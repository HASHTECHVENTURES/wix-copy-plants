import { getSupabase } from '../db.js';

export const saveWebPrev = {
    path: '/api/save-webprev/',
    method: 'post',
    handler: async (req, res) => {
        const { websiteId, imageUri } = req.body;
        const supabase = getSupabase();

        const { error } = await supabase
            .from('websites')
            .update({ prev_img_uri: imageUri })
            .eq('id', websiteId);

        if (error) {
            return res.status(500).json({ message: 'Failed to update preview image', error: error.message });
        }

        res.status(200).json({ message: 'Image updated' });
    },
};
