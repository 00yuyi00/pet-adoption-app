import { ArrowLeft, Share2, Heart, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function PetDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { favorites, toggleFavorite } = useAppContext();

  const isFav = id ? favorites.includes(id) : false;

  return (
    <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col bg-[#f8f7f6] dark:bg-[#221a10] shadow-2xl overflow-hidden text-[#1b160d] dark:text-white">
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button onClick={() => id && toggleFavorite(id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all">
            <Heart className={`w-6 h-6 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="relative w-full aspect-[4/5] bg-gray-200">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuASyRHkHadXPJRsuTnyBoWk1e9S7XnbaLtBx6KxEkVGs_8_Tl3ogrywsh0goVWDMf_24Q09h48rzMmoVVz1IBPf6PH7DGSuj-l8ktNA3GMG5pK6UopCmky6tCrc7A8a-7rTtXRILIWqZ6KALbA4Y3EOW9deDAEDbCOEdF0n-wVn9hkGPEE2XIK3Kn2QjxQHH6pmPRfBA7gakkPRXTwcNGLosL7Nz_cpSdQqjZa-MG1CMFPbzTPchooAC0pi27YAqE6mxJP0EuM4nqSS"
            alt="Pet"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="px-5 pt-6 pb-4 bg-white dark:bg-[#2d2418] rounded-t-3xl -mt-6 relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">豆豆</h2>
              <p className="mt-1 text-sm text-[#9a794c] dark:text-gray-400 font-medium">比格犬 • 2岁 • 男孩</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold">
              待领养
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <MapPin className="w-4 h-4" />
            <span>上海市浦东新区</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#f8f7f6] dark:bg-[#221a10] p-3 rounded-xl text-center">
              <div className="text-xs text-gray-500 mb-1">免疫情况</div>
              <div className="font-bold text-sm text-[#ee9d2b]">已接种</div>
            </div>
            <div className="bg-[#f8f7f6] dark:bg-[#221a10] p-3 rounded-xl text-center">
              <div className="text-xs text-gray-500 mb-1">驱虫情况</div>
              <div className="font-bold text-sm text-[#ee9d2b]">已驱虫</div>
            </div>
            <div className="bg-[#f8f7f6] dark:bg-[#221a10] p-3 rounded-xl text-center">
              <div className="text-xs text-gray-500 mb-1">绝育情况</div>
              <div className="font-bold text-sm text-[#ee9d2b]">已绝育</div>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-3">宠物故事</h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
            豆豆是一只非常活泼亲人的比格犬。它之前在街头流浪，被救助站的志愿者发现并带回。经过一段时间的调理，现在非常健康。它喜欢和人互动，希望能找到一个有爱心、有时间陪伴它的家庭。
          </p>

          <h3 className="text-lg font-bold mb-3">领养要求</h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 仅限上海同城领养
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 有稳定的住所和收入
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 接受定期视频回访
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 科学喂养，按时疫苗驱虫
            </li>
          </ul>

          <div className="flex items-center gap-3 p-4 bg-[#f8f7f6] dark:bg-[#221a10] rounded-xl">
            <img src="https://picsum.photos/seed/user1/100/100" alt="救助人" className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1">
              <div className="font-bold text-sm flex items-center gap-1">
                上海流浪动物救助站 <ShieldCheck className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xs text-gray-500">已实名认证机构</div>
            </div>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 border-t border-black/5 dark:border-white/5 bg-white dark:bg-[#2d2418] p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <Link to={`/adopt/${id}`} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ee9d2b] text-base font-bold text-white shadow-md shadow-orange-200 dark:shadow-none hover:bg-orange-500 active:scale-[0.98] transition-all">
          申请领养
        </Link>
      </div>
    </div>
  );
}
