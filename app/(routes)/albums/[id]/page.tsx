'use client';

import { Album, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Album {
  id: number;
  title: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const AlbumDetailPage = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Handle photo click to open preview
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  // Close the preview modal
  const closePreview = () => {
    setSelectedPhoto(null);
  };

  // Navigate to previous photo
  const handlePrevious = () => {
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto?.id);
    if (currentIndex > 0) {
      setSelectedPhoto(photos[currentIndex - 1]);
    }
  };

  // Navigate to next photo
  const handleNext = () => {
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto?.id);
    if (currentIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentIndex + 1]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [albumResponse, photoResponse] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/albums/${id}`),
          fetch(`https://jsonplaceholder.typicode.com/photos?_end=10&_start=0&albumId=${id}`),
        ]);

        if (!albumResponse.ok  || !photoResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        const albumData = await albumResponse.json();
        const photoData = await photoResponse.json();

        const [userResponse] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/users/${albumData.userId}`),
        ]);

        if (!userResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const userData = await userResponse.json();

        setAlbum(albumData);
        setUser(userData);
        setPhotos(photoData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Helper to get UI Avatars URL
  const getAvatarUrl = (name: string) => {
    const formattedName = name ? name.replace(' ', '+') : 'Unknown';
    return `https://ui-avatars.com/api/?name=${formattedName}&size=40&background=00a3e0&color=ffffff&rounded=true`;
  };

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!album || !user) return <div className="p-6 text-gray-600">Album not found</div>;

  return (
    <div>
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/albums" className="hover:text-blue-600">
        <Album className="w-4 h-4 inline mr-1" />
        Albums
        </Link>
         {' > '}
        <span>Show</span>
      </nav>
      <div className="mb-4 flex items-center">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <p>Show Album</p>
      </div>
      <div className="p-6 bg-white border shadow-md rounded-lg">
        <div className="flex items-center mb-4">
          <img
            src={getAvatarUrl(user.name)}
            alt={user.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <a href={`/users/${user.id}`} className="text-normal font-semibold text-blue-600 hover:text-blue-400">{user.name}</a>
            <p className="text-blue-600 text-sm">{user.email}</p>
          </div>
        </div>
        <h1 className="text-xl font-semibold mb-4 border-b pb-4">{album.title}</h1>
        <div className="flex">
          {photos.map((p) => (
            <div key={p.id} className="w-1/3 p-2">
              <Image
                src={p.thumbnailUrl.replace('https://via.placeholder.com', 'https://dummyjson.com/image')}
                alt={p.title}
                width={150}
                height={150}
                className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handlePhotoClick(p)}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Modal for photo preview */}
      {selectedPhoto && (
        <div className="fixed w-full h-full inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-800 opacity-50" onClick={closePreview}></div>
          <button
              onClick={closePreview}
              className="absolute top-8 right-8 text-white p-2 bg-gray-600 opacity-50 rounded-full hover:bg-gray-800"
            >
              <X size={24} />
            </button>
            <button
              onClick={handlePrevious}
              className={`absolute left-8 top-1/2 transform -translate-y-1/2 p-2 bg-gray-600 text-white rounded-full hover:bg-gray-800 ${photos.findIndex((p) => p.id === selectedPhoto.id) === 0 ? 'hidden' : ''}`}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className={`absolute right-8 top-1/2 transform -translate-y-1/2 p-2 bg-gray-600 text-white rounded-full hover:bg-gray-800 ${photos.findIndex((p) => p.id === selectedPhoto.id) === photos.length - 1 ? 'hidden' : ''}`}
            >
              <ChevronRight size={24} />
            </button>
          <div className="relative bg-white rounded-lg p-6 max-w-lg w-full">
            <Image
              src={selectedPhoto.url.replace('https://via.placeholder.com', 'https://dummyjson.com/image')}
              alt={selectedPhoto.title}
              width={600}
              height={600}
              className="rounded-lg mb-4"
            />
            <p className="text-gray-800 text-center">{selectedPhoto.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDetailPage;