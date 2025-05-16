'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Album {
  id: number;
  title: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
}

interface PaginatedResponse {
  data: Album[];
  total: number;
  pageSize: number;
  current: number;
}

const AlbumsPage = () => {
  const searchParams = useSearchParams();
  const pageSizeParam = searchParams.get('pageSize') || '10';
  const currentParam = searchParams.get('current') || '1';
  const [albums, setAlbums] = useState<Album[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(Number(pageSizeParam));
  const [currentPage, setCurrentPage] = useState(Number(currentParam));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [albumsResponse, usersResponse] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/albums?_limit=${pageSize}&_page=${currentPage}`), // Simulate pagination
          fetch('https://jsonplaceholder.typicode.com/users'),
        ]);

        if (!albumsResponse.ok || !usersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const albumsData = await albumsResponse.json();
        const usersData = await usersResponse.json();

        // Simulate paginated response (adjust based on your API)
        const totalItems = 100; // Replace with actual total from API if available
        setAlbums(albumsData);
        setUsers(usersData);
        setTotal(totalItems);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageSize, currentPage]);

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const totalPages = Math.ceil(total / pageSize);
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => {
          setCurrentPage((prev) => Math.max(1, prev - 1));
          window.history.pushState({}, '', `?pageSize=${pageSize}&current=${Math.max(1, currentPage - 1)}`);
        }}
        disabled={currentPage === 1}
        className="px-3 py-1 hover:bg-gray-300 rounded-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {'<'}
      </button>
    );

    // First page and ellipsis if startPage > 2
    if (startPage > 2) {
      buttons.push(
        <button
          key={1}
          onClick={() => {
            setCurrentPage(1);
            window.history.pushState({}, '', `?pageSize=${pageSize}&current=1`);
          }}
          className={`px-3 py-1 hover:bg-gray-300 rounded-sm ${currentPage === 1 ? 'bg-white border border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
        >
          1
        </button>
      );
      buttons.push(<span key="ellipsis1" className="px-3 py-1 text-gray-600">...</span>);
    } else if (startPage === 2) {
      buttons.push(
        <button
          key={1}
          onClick={() => {
            setCurrentPage(1);
            window.history.pushState({}, '', `?pageSize=${pageSize}&current=1`);
          }}
          className={`px-3 py-1 hover:bg-gray-300 rounded-sm ${currentPage === 1 ? 'bg-white border border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
        >
          1
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => {
            setCurrentPage(i);
            window.history.pushState({}, '', `?pageSize=${pageSize}&current=${i}`);
          }}
          className={`px-3 py-1 hover:bg-gray-300 rounded-sm ${currentPage === i ? 'bg-white border border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
        >
          {i}
        </button>
      );
    }

    // Ellipsis and last page if endPage < totalPages - 1
    if (endPage < totalPages - 1) {
      buttons.push(<span key="ellipsis2" className="px-3 py-1 text-gray-600">...</span>);
      buttons.push(
        <button
          key={totalPages}
          onClick={() => {
            setCurrentPage(totalPages);
            window.history.pushState({}, '', `?pageSize=${pageSize}&current=${totalPages}`);
          }}
          className={`px-3 py-1 hover:bg-gray-300 rounded-sm ${currentPage === totalPages ? 'bg-white border border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
        >
          {totalPages}
        </button>
      );
    } else if (endPage === totalPages - 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => {
            setCurrentPage(totalPages);
            window.history.pushState({}, '', `?pageSize=${pageSize}&current=${totalPages}`);
          }}
          className={`px-3 py-1 hover:bg-gray-300 rounded-sm ${currentPage === totalPages ? 'bg-white border border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => {
          setCurrentPage((prev) => Math.min(totalPages, prev + 1));
          window.history.pushState({}, '', `?pageSize=${pageSize}&current=${Math.min(totalPages, currentPage + 1)}`);
        }}
        disabled={currentPage === totalPages}
        className="px-3 py-1 hover:bg-gray-300 rounded-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {'>'}
      </button>
    );

    return buttons;
  };
  // Helper to get user's name by userId
  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  // Helper to get UI Avatars URL
  const getAvatarUrl = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    const name = user ? user.name.replace(' ', '+') : 'Unknown';
    return `https://ui-avatars.com/api/?name=${name}&size=32&background=random&color=ffffff&rounded=true`;
  };

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className='p-6'>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-black font-semibold"><p className='px-4 my-4 border-r border-gray-300'>ID</p></th>
              <th className="text-left text-black font-semibold"><p className='px-4 my-4 border-r border-gray-300'>Title</p></th>
              <th className="text-left text-black font-semibold"><p className='px-4 my-4 border-r border-gray-300'>User</p></th>
              <th className="text-left text-black font-semibold"><p className='px-4 my-4'>Action</p></th>
            </tr>
          </thead>
          <tbody className='bg-white text-sm'>
            {albums.map((album) => (
              <tr key={album.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 text-gray-600">{album.id}</td>
                <td className="p-4 text-gray-600">{album.title}</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <img
                      src={getAvatarUrl(album.userId)}
                      alt={getUserName(album.userId)}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-blue-600">{getUserName(album.userId)}</span>
                  </div>
                </td>
                <td className="p-4">
                  <Link href={`/albums/${album.id}`} className="w-[80px] flex items-center justify-center text-gray-600 hover:text-blue-600 border hover:border-blue-600 rounded">
                    <Eye className="w-5 h-5 mr-1" />
                    Show
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center mt-4 gap-2">
        <div className="flex space-x-1">
          {getPaginationButtons()}
        </div>
        <div className="text-gray-600">
          <select
            value={pageSize}
            onChange={(e) => {
              const newPageSize = Number(e.target.value);
              setPageSize(newPageSize);
              setCurrentPage(1);
              window.history.pushState({}, '', `?pageSize=${newPageSize}&current=1`);
            }}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={10}>10/100</option>
            <option value={20}>20/100</option>
            <option value={50}>50/100</option>
            <option value={100}>100/100</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AlbumsPage;