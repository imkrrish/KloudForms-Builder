import { initializeApp } from 'firebase/app';
import { getStorage, ref, deleteObject } from 'firebase/storage';

// Initialize Firebase
const firebaseApp = initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
});

// Create an instance of Firebase Storage
const storage = getStorage(firebaseApp);

// Function to delete an image by URL
const deleteImageFromFirebase = async (imageUrl: string): Promise<void> => {
  try {
    // Parse the URL to get the path within the storage bucket
    const urlParts = imageUrl.split('/');
    const path = urlParts.slice(urlParts.indexOf('o') + 1).join('/');

    // Create a reference to the image
    const imageRef = ref(storage, path);

    // Delete the image
    await deleteObject(imageRef);

    console.log('Image deleted successfully.');
  } catch (error) {
    console.error('Image deletion failed:', error);
    throw error;
  }
};

// Example usage:
const imageUrlToDelete = 'https://storage.googleapis.com/YOUR_STORAGE_BUCKET/images/image.jpg';
deleteImageFromFirebase(imageUrlToDelete)
  .then(() => {
    console.log('Image deleted successfully.');
  })
  .catch((error) => {
    console.error('Image deletion failed:', error);
  });
