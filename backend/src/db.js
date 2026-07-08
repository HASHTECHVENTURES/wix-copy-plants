import { createClient } from '@supabase/supabase-js';

let supabase;

export const initializeDbConnection = async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
    }

    supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};

export const getSupabase = () => {
    if (!supabase) {
        throw new Error('Database not initialized. Call initializeDbConnection() first.');
    }
    return supabase;
};

const toCamelCase = (row) => {
    if (!row) return null;

    return {
        _id: row.id,
        email: row.email,
        passwordHash: row.password_hash,
        username: row.username,
        isEmailVerified: row.is_email_verified,
        apiVersion: row.api_version,
        websiteName: row.website_name,
        author: row.author,
        prevImgUri: row.prev_img_uri,
        published: row.published,
        pages: row.pages ?? [],
        projectId: row.project_id,
        pageUri: row.page_uri,
        pageName: row.page_name,
        projectAuthor: row.project_author,
        websiteSetting: row.website_setting,
        pageMode: row.page_mode,
        settigMode: row.settig_mode,
        isDropEnabled: row.is_drop_enabled,
        analyticsID: row.analytics_id,
        dropIndex: row.drop_index,
        fonts: row.fonts ?? [],
        elements: row.elements ?? [],
    };
};

export const mapUser = (row) => {
    if (!row) return null;
    return {
        _id: row.id,
        email: row.email,
        passwordHash: row.password_hash,
        username: row.username,
        isEmailVerified: row.is_email_verified,
        apiVersion: row.api_version,
    };
};

export const mapWebsite = (row) => toCamelCase(row);
export const mapWebPage = (row) => toCamelCase(row);

export const webPageToRow = (doc) => {
    const row = {};

    if (doc.projectId !== undefined) row.project_id = doc.projectId;
    if (doc.pageUri !== undefined) row.page_uri = doc.pageUri;
    if (doc.pageName !== undefined) row.page_name = doc.pageName;
    if (doc.projectAuthor !== undefined) row.project_author = doc.projectAuthor;
    if (doc.websiteSetting !== undefined) row.website_setting = doc.websiteSetting;
    if (doc.published !== undefined) row.published = doc.published;
    if (doc.pageMode !== undefined) row.page_mode = doc.pageMode;
    if (doc.settigMode !== undefined) row.settig_mode = doc.settigMode;
    if (doc.isDropEnabled !== undefined) row.is_drop_enabled = doc.isDropEnabled;
    if (doc.analyticsID !== undefined) row.analytics_id = doc.analyticsID;
    if (doc.dropIndex !== undefined) row.drop_index = doc.dropIndex;
    if (doc.fonts !== undefined) row.fonts = doc.fonts;
    if (doc.elements !== undefined) row.elements = doc.elements;

    return row;
};
