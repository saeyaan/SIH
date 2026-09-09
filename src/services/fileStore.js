import { supabase } from '../lib/supabaseClient';

// We create a clean service interface for Supabase Storage.
// If the backend bucket 'materials' is not configured, we gracefully fallback
// to IndexedDB to keep the UI functional for demo purposes, but we report the missing setup.

const DB_NAME = 'bhashasetu_files_db';
const STORE_NAME = 'files';

const getDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveFile = async (fileId, fileBlob, fileName, fileType, fileSize) => {
  if (supabase) {
    try {
      const filePath = `lessons/${fileId}_${fileName}`;
      const { data, error } = await supabase.storage.from('materials').upload(filePath, fileBlob, {
        contentType: fileType,
        upsert: true
      });
      
      if (error) {
        console.warn('Supabase Storage upload failed (Bucket "materials" might be missing). Falling back to IndexedDB.', error);
        throw error;
      }
      
      // Successfully uploaded to Supabase
      return { id: filePath, provider: 'supabase' };
    } catch (err) {
      // Fallback to IndexedDB
      return await saveToIndexedDB(fileId, fileBlob, fileName, fileType, fileSize);
    }
  } else {
     return await saveToIndexedDB(fileId, fileBlob, fileName, fileType, fileSize);
  }
};

const saveToIndexedDB = async (fileId, fileBlob, fileName, fileType, fileSize) => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({
      id: fileId,
      blob: fileBlob,
      name: fileName,
      type: fileType,
      size: fileSize,
      timestamp: Date.now()
    });
    
    request.onsuccess = () => resolve({ id: fileId, provider: 'indexeddb' });
    request.onerror = () => reject(request.error);
  });
};

export const getFile = async (fileId, provider = 'indexeddb') => {
  if (provider === 'supabase' && supabase) {
     const { data, error } = await supabase.storage.from('materials').createSignedUrl(fileId, 3600);
     if (!error && data) {
        return { url: data.signedUrl };
     }
  }
  
  // Fallback to IndexedDB
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(fileId);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getFileUrl = async (fileId, provider) => {
  const fileData = await getFile(fileId, provider);
  if (fileData?.url) return fileData.url;
  if (fileData?.blob) {
      return URL.createObjectURL(fileData.blob);
  }
  return null;
}
