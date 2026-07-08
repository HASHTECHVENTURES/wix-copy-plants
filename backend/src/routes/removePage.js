import { getSupabase } from '../db.js';

export const removeWebPage = {
    path: '/api/remove-webpage/',
    method: 'post',
    handler: async (req, res) => {
        const { pageId, webId } = req.body;
        const supabase = getSupabase();

        const { data: delpage, error: findError } = await supabase
            .from('web_pages')
            .select('page_name')
            .eq('id', pageId)
            .single();

        if (findError) {
            return res.status(500).json({ message: 'Page not found', error: findError.message });
        }

        const { error: deleteError } = await supabase
            .from('web_pages')
            .delete()
            .eq('id', pageId);

        if (deleteError) {
            return res.status(500).json({ message: 'Failed to delete page', error: deleteError.message });
        }

        const { data: websiteData, error: websiteError } = await supabase
            .from('websites')
            .select('pages')
            .eq('id', webId)
            .single();

        if (websiteError) {
            return res.status(500).json({ message: 'Failed to update website', error: websiteError.message });
        }

        const updatedPages = (websiteData.pages ?? []).filter(
            (page) => page.pageId !== pageId,
        );

        const { error: updateError } = await supabase
            .from('websites')
            .update({ pages: updatedPages })
            .eq('id', webId);

        if (updateError) {
            return res.status(500).json({ message: 'Failed to update website pages', error: updateError.message });
        }

        const firstPageId = updatedPages[0]?.pageId ?? null;
        res.status(200).json({ message: 'Website deleted', pageId: firstPageId });
    },
};
