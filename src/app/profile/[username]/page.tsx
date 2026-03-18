"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User, Post } from "@/lib/types";
import { CURRENT_USER } from "@/lib/mock-data";
import Link from "next/link";
import Toast from "@/components/Toast";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/profile/${username}`)
      .then((res) => res.json())
      .then(({ user, posts }) => {
        setUser(user);
        setPosts(posts);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Loading profile…</div>;
  if (!user) return <div className="flex justify-center py-20 text-gray-400">User not found.</div>;

  const isOwn = username === CURRENT_USER.username;

  function handleFollow() {
    setToast(`${user!.username} seguido con éxito`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex gap-8 md:gap-16 items-start mb-8">
        <div className="flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar}
            alt={user.username}
            className="w-20 h-20 md:w-36 md:h-36 rounded-full object-cover border border-gray-200"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-xl font-light">{user.username}</h1>
            {user.isVerified && (
              <svg viewBox="0 0 24 24" fill="#3b82f6" className="w-5 h-5" aria-label="Verified">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            )}
            {isOwn ? (
              <Link href="/profile/edit" className="px-4 py-1.5 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Edit profile
              </Link>
            ) : (
              <>
                <button
                  onClick={handleFollow}
                  className="px-6 py-1.5 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Follow
                </button>
                <Link href="/messages" className="px-4 py-1.5 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Message
                </Link>
              </>
            )}
          </div>

          <div className="flex gap-6 mb-4">
            <div>
              <span className="font-semibold">{user.postsCount.toLocaleString()}</span>
              <span className="text-sm text-gray-500 ml-1">posts</span>
            </div>
            <button className="hover:opacity-70">
              <span className="font-semibold">{user.followersCount.toLocaleString()}</span>
              <span className="text-sm text-gray-500 ml-1">followers</span>
            </button>
            <button className="hover:opacity-70">
              <span className="font-semibold">{user.followingCount.toLocaleString()}</span>
              <span className="text-sm text-gray-500 ml-1">following</span>
            </button>
          </div>

          <div>
            <p className="font-semibold text-sm">{user.name}</p>
            {user.bio && <p className="text-sm whitespace-pre-line mt-0.5">{user.bio}</p>}
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-900 font-semibold hover:underline mt-0.5 block">
                {user.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200 flex justify-center gap-10 mb-6">
        <button className="flex items-center gap-1.5 py-3 border-t-2 border-gray-900 text-xs font-semibold uppercase tracking-widest">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          Posts
        </button>
        <button className="flex items-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 9h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 20.625v-9.75C1.5 9.839 2.34 9 3.375 9z" />
          </svg>
          Reels
        </button>
        {isOwn && (
          <button className="flex items-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            Saved
          </button>
        )}
      </div>

      {/* Posts grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-0.5">
          {posts.map((post) => (
            <div key={post.id} className="relative aspect-square group overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <span className="text-white text-sm font-semibold flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {post.likesCount.toLocaleString()}
                </span>
                <span className="text-white text-sm font-semibold flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                  </svg>
                  {post.commentsCount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
          <p className="font-semibold text-lg">No posts yet</p>
        </div>
      )}
    </div>
  );
}
