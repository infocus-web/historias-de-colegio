import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ntkqypxvrljuihbxdrtx.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_94eG1ynOFoTUTPfcKgBwlw_rfhcRNbT';

// Get keys from environment or localStorage for easy configuration from Admin panel
export function getSupabaseConfig() {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
  const envUrl = metaEnv?.VITE_SUPABASE_URL;
  const envKey = metaEnv?.VITE_SUPABASE_ANON_KEY;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('infocus_supabase_anon_key') : null;
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('infocus_supabase_url') : null;

  return {
    url: storedUrl || envUrl || DEFAULT_SUPABASE_URL,
    anonKey: storedKey || envKey || DEFAULT_SUPABASE_ANON_KEY
  };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('infocus_supabase_url', url.trim());
    if (anonKey) localStorage.setItem('infocus_supabase_anon_key', anonKey.trim());
  }
  supabaseInstance = null;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.anonKey) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(config.url, config.anonKey);
  }
  return supabaseInstance;
}

export function isSupabaseConnected(): boolean {
  return !!getSupabaseConfig().anonKey;
}

/**
 * Upload an original High Resolution photo or ZIP to private 'fotos-hd' bucket
 */
export async function uploadFotoHD(file: File | Blob, filePath: string): Promise<{ path: string; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { path: filePath, error: 'Supabase no conectado con anon key' };
  }

  const { data, error } = await client.storage
    .from('fotos-hd')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || 'image/jpeg'
    });

  if (error) {
    return { path: '', error: error.message };
  }
  return { path: data.path };
}

/**
 * Upload a watermarked compressed web preview photo to public 'fotos-web' bucket
 */
export async function uploadFotoWeb(file: File | Blob, filePath: string): Promise<{ publicUrl: string; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { publicUrl: '', error: 'Supabase no conectado con anon key' };
  }

  const { data, error } = await client.storage
    .from('fotos-web')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || 'image/jpeg'
    });

  if (error) {
    return { publicUrl: '', error: error.message };
  }

  const { data: publicUrlData } = client.storage
    .from('fotos-web')
    .getPublicUrl(data.path);

  return { publicUrl: publicUrlData.publicUrl };
}

/**
 * Generate a signed temporary download URL for an HD original photo (only for parents with paid orders)
 */
export async function getSignedDownloadUrl(storagePath: string, expiresIn = 60 * 60 * 24 * 7): Promise<string | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client.storage
      .from('fotos-hd')
      .createSignedUrl(storagePath, expiresIn);

    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch (err) {
    console.error('Error generating signed URL:', err);
    return null;
  }
}
