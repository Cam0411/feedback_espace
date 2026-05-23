import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VideoFeedback from './pages/VideoFeedback';
import SharedVideoFeedback from './pages/SharedVideoFeedback';
import ActiveFeedback from './pages/ActiveFeedback';
import CommentHistory from './pages/CommentHistory';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'video/:id',
        element: <VideoFeedback />,
      },
      {
        path: 'video/shared/:shareId',
        element: <SharedVideoFeedback />,
      },
      {
        path: 'active-feedback',
        element: <ActiveFeedback />,
      },
      {
        path: 'comment-history',
        element: <CommentHistory />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mô phỏng quá trình khởi tạo ứng dụng
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-[#07080c] goku-background-charge font-sans text-slate-300">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
           <div className="w-24 h-24 bg-[#11121d] rounded-3xl flex items-center justify-center border border-[#f25c05]/50 relative overflow-hidden group goku-aura-orange">
             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-500/20 animate-pulse"></div>
             {/* Goku's signature "悟" Go Kanji watermark in background */}
             <div className="absolute inset-0 opacity-20 flex items-center justify-center text-4xl font-extrabold text-[#f25c05] select-none pointer-events-none font-display">悟</div>
             <img 
               src="/src/assets/images/espace_logo_1779517923818.png" 
               alt="Espace Logo" 
               className="w-16 h-16 object-contain z-10 animate-bounce" 
               style={{animationDuration: '2s'}}
               referrerPolicy="no-referrer"
             />
           </div>
           <div className="flex flex-col items-center gap-2">
             <h1 className="text-3xl font-black text-white tracking-tight uppercase italic goku-ki-text">Espace</h1>
             <div className="flex items-center gap-2 text-xs text-orange-500 font-extrabold uppercase tracking-[0.3em] opacity-90">
               <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
               ĐANG TẬP HỢP KI • ĐỒNG BỘ FIRESTORE
             </div>
           </div>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}
