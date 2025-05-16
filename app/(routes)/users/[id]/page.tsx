'use client';

import { ArrowLeft, Eye, User } from 'lucide-react';
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

const UserDetailPage = () => {
    const { id } = useParams();
    const [album, setAlbum] = useState<Album[] | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            setLoading(true);
            const [albumResponse, userResponse] = await Promise.all([
                fetch(`https://jsonplaceholder.typicode.com/albums?_end=10&_start=0&userId=${id}`),
                fetch(`https://jsonplaceholder.typicode.com/users/${id}`), // Adjust userId if different from albumId
            ]);

            if (!albumResponse.ok || !userResponse.ok) {
            throw new Error('Failed to fetch data');
            }

            const albumData = await albumResponse.json();
            const userData = await userResponse.json();

            setAlbum(albumData);
            setUser(userData);
            setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
          <Link href="/users" className="hover:text-blue-600"><User className="w-4 h-4 inline mr-1"/>Users</Link> {' > '}
          <span className='text-black'>Show</span>
      </nav>
      <div className="mb-4 flex items-center">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <p className='text-2xl'>Show User</p>
      </div>
      <div className="p-6 bg-white shadow-md rounded-lg">
        <div className="flex items-center mb-4 border-b pb-4">
            <img
            src={getAvatarUrl(user.name)}
            alt={user.name}
            className="w-10 h-10 rounded-full mr-3"
            />
            <div>
            <h2 className="text-lg font-semibold text-black">{user.name}</h2>
            <p className="text-blue-600 text-sm">{user.email}</p>
            </div>
        </div>
        <p className="font-semibold text-black text-lg">Albums</p>
        <table className="min-w-full">
            <thead className='bg-gray-100'>
            <tr className="border-b border-gray-200">
              <th className="p-4 text-left text-gray-600 font-semibold"><p className='px-4 border-r border-gray-300'>ID</p></th>
              <th className="p-4 text-left text-gray-600 font-semibold"><p className='px-4 border-r border-gray-300'>Title</p></th>
              <th className="p-4 text-left text-gray-600 font-semibold"><p className='px-4'>Actions</p></th>
            </tr>
          </thead>
          <tbody className='bg-white text-sm'>
            {album.map((album) => (
              <tr key={album.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 text-gray-600">{album.id}</td>
                <td className="p-4 text-gray-600">{album.title}</td>
                <td className="p-4">
                  <Link href={`/albums/${album.id}`} className="w-[80px] flex items-center justify-center text-gray-600 hover:text-blue-600 border hover:border-blue-600 rounded-sm">
                    <Eye className="w-5 h-5 mr-1" />
                    <p>Show</p>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDetailPage