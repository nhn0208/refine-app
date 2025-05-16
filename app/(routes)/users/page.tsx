'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    streeet: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ usersResponse] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/users'),
        ]);

        if (!usersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const usersData = await usersResponse.json();

        setUsers(usersData);
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
    return `https://ui-avatars.com/api/?name=${name}&size=32&background=random&color=ffffff&rounded=true`;
  };

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className='p-6 overflow-y-auto'>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-gray-600 font-semibold"><p className='px-4 my-4 border-r border-gray-300'>ID</p></th>
              <th className="text-left text-gray-600 font-semibold"><p className='px-4 my-4 border-r border-gray-300'>Avatar</p></th>
              <th className="text-left text-gray-600 font-semibold"><p className='px-4 my-4 border-r border-gray-300'>Name</p></th>
              <th className="text-left text-gray-600 font-semibold"><p className='px-4 my-4 border-r border-gray-300'>Email</p></th>
              <th className="text-left text-gray-600 font-semibold"><p className='px-4 my-4 border-r border-gray-300'>Phone</p></th>
              <th className="text-left text-gray-600 font-semibold"><p className='px-4 my-4 border-r border-gray-300'>Website</p></th>
              <th className="text-left text-gray-600 font-semibold"><p className='px-4 my-4'>Actions</p></th>
            </tr>
          </thead>
          <tbody className='bg-white text-sm'>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 text-gray-600">{user.id}</td>
                <td className="p-4">
                  <img
                    src={getAvatarUrl(user.name)}
                    alt={user.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                </td>
                <td className="p-4 text-gray-600">{user.name}</td>
                <td className="p-4 text-blue-400">{user.email}</td>
                <td className="p-4 text-blue-400">{user.phone}</td>
                <td className="p-4 text-blue-400">{user.website}</td>
                <td className="p-4">
                  <Link href={`/users/${user.id}`} className="w-[80px] flex items-center justify-center text-gray-600 hover:text-blue-600 border hover:border-blue-600 rounded-sm">
                    <Eye className="w-5 h-5 mr-1" />
                    Show
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default UsersPage;