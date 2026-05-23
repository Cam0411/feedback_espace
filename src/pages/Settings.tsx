import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User } from '../types';
import { dbService } from '../services/db';
import { Settings as SettingsIcon, User as UserIcon, Mail, Lock, Check, AlertCircle, Flame, ShieldAlert, Trash2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const { user, setUser } = useOutletContext<{ user: User | null, setUser: (u: User) => void }>();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for purging admin's firebase data
  const [purgeLoading, setPurgeLoading] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState<string | null>(null);
  const [purgeError, setPurgeError] = useState<string | null>(null);
  const [purgeConfirmText, setPurgeConfirmText] = useState('');
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await dbService.updateUserName(user.id, name);
      setUser({ ...user, name });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Không thể cập nhật hồ sơ.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      await dbService.resetPassword(user.email);
      alert('Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
    } catch (err) {
      alert('Lỗi khi gửi email khôi phục mật khẩu.');
      console.error(err);
    }
  };

  const handlePurgeFirebaseData = async () => {
    if (purgeConfirmText.trim() !== 'XÓA TOÀN BỘ' && purgeConfirmText.trim().toLowerCase() !== 'xóa dữ liệu') {
      setPurgeError('Vui lòng nhập đúng cụm từ "XÓA TOÀN BỘ" để xác nhận.');
      return;
    }

    setPurgeLoading(true);
    setPurgeError(null);
    setPurgeSuccess(null);

    try {
      const counts = await dbService.purgeAdminFirebaseData(
        user?.email || 'duongnguyencam05@gmail.com', 
        user?.name || 'e space'
      );
      
      setPurgeSuccess(
        `💥 KI-BLAST PURGE THÀNH CÔNG: Đã xóa ${counts.usersDeleted} user profile, ${counts.videosDeleted} video, ${counts.commentsDeleted} bình luận, ${counts.notificationsDeleted} thông báo, ${counts.sharedLinksDeleted} link chia sẻ!`
      );
      setPurgeConfirmText('');
      setShowPurgeConfirm(false);
    } catch (err: any) {
      setPurgeError(err.message || 'Lỗi khi xóa dữ liệu.');
      console.error(err);
    } finally {
      setPurgeLoading(false);
    }
  };

  if (!user) return null;

  const isAdminEmail = user.email?.toLowerCase() === 'duongnguyencam05@gmail.com' || user.name?.toLowerCase() === 'e space';

  return (
    <div className="flex flex-col h-full bg-[#07080c] goku-background-charge text-slate-300">
      <header className="p-8 border-b border-[#2e3138] flex items-center justify-between bg-[#14151a]/80 backdrop-blur-xl shrink-0">
        <div>
          <h1 className="text-2xl font-black text-rose-500 tracking-tighter flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-rose-500" />
            CÀI ĐẶT HỆ THỐNG
          </h1>
          <p className="text-slate-400 text-sm mt-1">Quản lý tài khoản và thiết lập cơ sở dữ liệu</p>
        </div>
      </header>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-8">
          <section className="bg-[#14151a]/95 p-8 rounded-3xl border border-[#2e3138] shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-amber-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-inner overflow-hidden uppercase">
                {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
                <p className="text-slate-500 text-sm">{user.email}</p>
                <div className="mt-1 inline-flex px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase rounded tracking-widest border border-rose-500/20">
                  {user.role}
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Họ và tên</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-rose-500 transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0e1015]/80 border border-[#2e3138] text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-rose-500 hover:border-slate-600 outline-none transition-all placeholder:text-slate-700 font-bold"
                    placeholder="Nhập tên của bạn..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email (Không thể thay đổi)</label>
                <div className="relative opacity-50 grayscale">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full bg-[#0e1015]/80 border border-[#2e3138] text-slate-400 rounded-2xl py-4 pl-12 pr-4 outline-none cursor-not-allowed font-bold"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-500 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                  <Check className="w-5 h-5" />
                  Cập nhật hồ sơ thành công!
                </div>
              )}

              <button
                type="submit"
                disabled={loading || name === user.name}
                className="w-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 disabled:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-rose-500/20 uppercase tracking-widest"
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </form>
          </section>

          {/* DANGER ZONE - PURGE FIREBASE DATA FOR THE ADMIN */}
          {(isAdminEmail || user.role === 'admin') && (
            <section className="bg-gradient-to-br from-red-950/40 to-amber-950/30 p-8 rounded-3xl border border-red-500/35 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <h3 className="text-md font-black text-rose-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Flame className="w-6 h-6 text-amber-500 animate-pulse" />
                DANGER ZONE: KHU VỰC TIÊU HỦY DỮ LIỆU
              </h3>
              
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Yêu cầu từ Quản trị viên <strong className="text-rose-400">duongnguyencam05@gmail.com / e space</strong>: Xóa vĩnh viễn toàn bộ cơ sở dữ liệu Firebase (bao gồm profile user, danh sách các video đã tạo, tất cả comment nhận xét, các thông báo liên quan và liên kết chia sẻ). Hành động này không thể hoàn tác!
              </p>

              {purgeSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-400 text-sm flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-2 font-black uppercase tracking-wider">
                    <Check className="w-5 h-5" />
                    Thành công
                  </div>
                  <p>{purgeSuccess}</p>
                </div>
              )}

              {purgeError && (
                <div className="bg-red-500/15 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm flex items-center gap-3 mb-6 font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {purgeError}
                </div>
              )}

              {!showPurgeConfirm ? (
                <button
                  onClick={() => setShowPurgeConfirm(true)}
                  className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black rounded-2xl transition-all text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                  TIẾN HÀNH XÓA DỮ LIỆU FIREBASE
                </button>
              ) : (
                <div className="bg-black/40 p-6 rounded-2xl border border-red-500/20 space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <p className="text-xs font-black uppercase text-amber-400 tracking-wider">Cần xác nhận tối cao</p>
                      <p className="text-xs text-slate-400 mt-1">Để tránh tai nạn, vui lòng nhập chính xác cụm từ <strong className="text-red-400">XÓA TOÀN BỘ</strong> hoặc <strong className="text-red-400">xóa dữ liệu</strong> vào ô bên dưới:</p>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={purgeConfirmText}
                    onChange={(e) => setPurgeConfirmText(e.target.value)}
                    className="w-full bg-slate-950/80 border border-red-500/30 text-white rounded-xl py-3 px-4 outline-none focus:border-red-500 text-sm font-bold"
                    placeholder="Nhập vào đây để xác nhận..."
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowPurgeConfirm(false);
                        setPurgeConfirmText('');
                        setPurgeError(null);
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-widest"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handlePurgeFirebaseData}
                      disabled={purgeLoading}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black rounded-xl text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-red-600/35"
                    >
                      {purgeLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          Đang xóa...
                        </>
                      ) : (
                        'XÁC NHẬN TIÊU HỦY DỮ LIỆU'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="bg-[#14151a]/95 p-8 rounded-3xl border border-[#2e3138] shadow-xl">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-500" />
              BẢO MẬT TÀI KHOẢN
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Nếu bạn muốn thay đổi mật khẩu hoặc đã quên mật khẩu cũ, hãy nhấn nút bên dưới để nhận email khôi phục.
            </p>
            <button
              onClick={handleResetPassword}
              className="px-6 py-3 bg-[#0e1015]/80 border border-[#2e3138] text-slate-300 font-bold rounded-xl hover:bg-[#1c1e23] hover:text-white transition-all text-xs uppercase tracking-widest"
            >
              Đặt lại mật khẩu qua Email
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
