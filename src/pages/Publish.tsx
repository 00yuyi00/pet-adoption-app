import { X, Camera, MapPin, Search, Map, FileText, Phone, Send, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export default function Publish() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [postType, setPostType] = useState<'lost' | 'found' | 'adopt'>('lost');
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');

  // Form State
  const [petName, setPetName] = useState('');
  const [description, setDescription] = useState('');
  const [locationStr, setLocationStr] = useState('');
  const [hasReward, setHasReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    if (!user?.id) {
      alert('请先登录后再发布！');
      return;
    }

    if (!description || !locationStr) {
      alert('请填写必要的信息（位置和描述）');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = petType === 'dog'
        ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800';

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pets')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('pets')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      const { error } = await supabase.from('pets').insert({
        user_id: user.id,
        post_type: postType,
        category: petType,
        name: petName || (postType === 'lost' ? '走失宠物' : '待领养宠物'),
        description: description,
        location: locationStr,
        image_url: finalImageUrl,
        gender: 'unknown',
        status: '未知',
        reward: hasReward && rewardAmount ? `¥${rewardAmount}` : null
      });

      if (error) throw error;

      alert('发布成功！');
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      alert('发布失败: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (!window.confirm('确定要清空当前填写的所有信息吗？')) return;
    setPostType('lost');
    setPetType('dog');
    setPetName('');
    setDescription('');
    setLocationStr('');
    setHasReward(false);
    setRewardAmount('');
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-[#f8f7f6] dark:bg-[#221a10] min-h-screen text-slate-900 dark:text-slate-100">
      <div className="sticky top-0 z-10 flex items-center bg-[#f8f7f6] dark:bg-[#221a10]/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-stone-200 dark:border-stone-800">
        <button onClick={() => navigate(-1)} className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">发布信息</h2>
        <button onClick={handleReset} className="flex w-12 items-center justify-end text-[#ee9d2b] text-base font-bold hover:opacity-80 transition-opacity">
          重置
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="flex px-4 py-4">
          <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-stone-200 dark:bg-stone-800 p-1">
            <label className="relative flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all duration-200 has-[:checked]:bg-white dark:has-[:checked]:bg-stone-700 has-[:checked]:shadow-sm">
              <span className="text-stone-500 dark:text-stone-400 font-medium text-xs sm:text-sm peer-checked:text-[#ee9d2b] dark:peer-checked:text-[#ee9d2b] transition-colors z-10 truncate">我要寻宠</span>
              <input
                type="radio"
                name="post_type"
                value="lost"
                checked={postType === 'lost'}
                onChange={() => setPostType('lost')}
                className="peer invisible absolute w-0 h-0"
              />
            </label>
            <label className="relative flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all duration-200 has-[:checked]:bg-white dark:has-[:checked]:bg-stone-700 has-[:checked]:shadow-sm">
              <span className="text-stone-500 dark:text-stone-400 font-medium text-xs sm:text-sm peer-checked:text-[#ee9d2b] dark:peer-checked:text-[#ee9d2b] transition-colors z-10 truncate">我捡到宠</span>
              <input
                type="radio"
                name="post_type"
                value="found"
                checked={postType === 'found'}
                onChange={() => setPostType('found')}
                className="peer invisible absolute w-0 h-0"
              />
            </label>
            <label className="relative flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all duration-200 has-[:checked]:bg-white dark:has-[:checked]:bg-stone-700 has-[:checked]:shadow-sm">
              <span className="text-stone-500 dark:text-stone-400 font-medium text-xs sm:text-sm peer-checked:text-[#ee9d2b] dark:peer-checked:text-[#ee9d2b] transition-colors z-10 truncate">我要送养</span>
              <input
                type="radio"
                name="post_type"
                value="adopt"
                checked={postType === 'adopt'}
                onChange={() => setPostType('adopt')}
                className="peer invisible absolute w-0 h-0"
              />
            </label>
          </div>
        </div>

        <div className="px-4 pb-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-[#ee9d2b]/40 bg-[#ee9d2b]/5 dark:bg-[#ee9d2b]/10 hover:bg-[#ee9d2b]/10 dark:hover:bg-[#ee9d2b]/20 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 overflow-hidden group"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="flex items-center justify-center size-16 rounded-full bg-[#ee9d2b]/20 text-[#ee9d2b] group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-8 h-8" />
                </div>
                <span className="text-[#ee9d2b] font-medium text-sm">点击上传宠物照片</span>
                <span className="text-stone-400 text-xs">支持 JPG, PNG</span>
              </>
            )}
          </div>
        </div>

        <div className="px-4 py-2">
          <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold mb-3 flex items-center gap-2">
            <span className="text-[#ee9d2b] text-xl">🐾</span>
            宠物类型
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <label className="relative cursor-pointer group">
              <input
                type="radio"
                name="pet_category"
                className="peer sr-only"
                checked={petType === 'dog'}
                onChange={() => setPetType('dog')}
              />
              <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-800/50 peer-checked:border-[#ee9d2b] peer-checked:bg-[#ee9d2b]/5 dark:peer-checked:bg-[#ee9d2b]/10 transition-all">
                <span className="text-2xl filter grayscale peer-checked:grayscale-0 transition-all duration-300">🐶</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 peer-checked:text-[#ee9d2b]">狗狗</span>
              </div>
              <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-[#ee9d2b] transition-opacity">
                <div className="w-5 h-5 rounded-full bg-[#ee9d2b] flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </label>
            <label className="relative cursor-pointer group">
              <input
                type="radio"
                name="pet_category"
                className="peer sr-only"
                checked={petType === 'cat'}
                onChange={() => setPetType('cat')}
              />
              <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-800/50 peer-checked:border-[#ee9d2b] peer-checked:bg-[#ee9d2b]/5 dark:peer-checked:bg-[#ee9d2b]/10 transition-all">
                <span className="text-2xl filter grayscale peer-checked:grayscale-0 transition-all duration-300">🐱</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 peer-checked:text-[#ee9d2b]">猫猫</span>
              </div>
              <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-[#ee9d2b] transition-opacity">
                <div className="w-5 h-5 rounded-full bg-[#ee9d2b] flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="h-px bg-stone-100 dark:bg-stone-800 mx-4 my-2"></div>

        {/* --- ADOPT OUT FIELDS --- */}
        {postType === 'adopt' && (
          <div className="px-4 py-2 space-y-5 animate-in fade-in duration-300">
            {/* Pet Basic Info */}
            <div className="space-y-3">
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#ee9d2b]" />
                宠物基本信息
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <input value={petName} onChange={(e) => setPetName(e.target.value)} type="text" placeholder="宠物昵称 (选填)" className="bg-white dark:bg-stone-800 border-0 ring-1 ring-stone-200 dark:ring-stone-700 focus:ring-2 focus:ring-[#ee9d2b] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-stone-400 outline-none" />
                <input type="text" placeholder="年龄 (如: 2个月/1岁)" className="bg-white dark:bg-stone-800 border-0 ring-1 ring-stone-200 dark:ring-stone-700 focus:ring-2 focus:ring-[#ee9d2b] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-stone-400 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select className="bg-white dark:bg-stone-800 border-0 ring-1 ring-stone-200 dark:ring-stone-700 focus:ring-2 focus:ring-[#ee9d2b] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none">
                  <option value="" disabled selected>选择性别</option>
                  <option value="male">公（DD）</option>
                  <option value="female">母（MM）</option>
                  <option value="unknown">未知</option>
                </select>
                <input type="text" placeholder="品种 (如: 田园猫/金毛)" className="bg-white dark:bg-stone-800 border-0 ring-1 ring-stone-200 dark:ring-stone-700 focus:ring-2 focus:ring-[#ee9d2b] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-stone-400 outline-none" />
              </div>
            </div>

            {/* Health Info */}
            <div className="space-y-3">
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold flex items-center gap-2">
                <span className="text-[#ee9d2b] text-xl">🏥</span>
                医疗健康状态
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-stone-800 ring-1 ring-stone-200 dark:ring-stone-700 rounded-xl p-3 flex flex-col gap-2">
                  <span className="text-xs text-stone-500 font-bold">疫苗注射</span>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 text-sm cursor-pointer"><input type="radio" name="vaccine" className="text-[#ee9d2b] focus:ring-[#ee9d2b]" /> 已接种</label>
                    <label className="flex items-center gap-1 text-sm cursor-pointer"><input type="radio" name="vaccine" className="text-[#ee9d2b] focus:ring-[#ee9d2b]" /> 未接种</label>
                  </div>
                </div>
                <div className="bg-white dark:bg-stone-800 ring-1 ring-stone-200 dark:ring-stone-700 rounded-xl p-3 flex flex-col gap-2">
                  <span className="text-xs text-stone-500 font-bold">绝育情况</span>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 text-sm cursor-pointer"><input type="radio" name="spay" className="text-[#ee9d2b] focus:ring-[#ee9d2b]" /> 已绝育</label>
                    <label className="flex items-center gap-1 text-sm cursor-pointer"><input type="radio" name="spay" className="text-[#ee9d2b] focus:ring-[#ee9d2b]" /> 未绝育</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Adoption Requirements */}
            <div className="space-y-3">
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold flex items-center gap-2">
                <span className="text-[#ee9d2b] text-xl">📋</span>
                领养要求
              </h3>
              <div className="bg-white dark:bg-stone-800 ring-1 ring-stone-200 dark:ring-stone-700 rounded-xl p-3 grid grid-cols-2 gap-y-3 gap-x-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded border-stone-300 text-[#ee9d2b] focus:ring-[#ee9d2b] h-4 w-4" /> 限同城领养
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded border-stone-300 text-[#ee9d2b] focus:ring-[#ee9d2b] h-4 w-4" /> 必须封闭阳台
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded border-stone-300 text-[#ee9d2b] focus:ring-[#ee9d2b] h-4 w-4" /> 接受视频回访
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded border-stone-300 text-[#ee9d2b] focus:ring-[#ee9d2b] h-4 w-4" /> 需有养宠经验
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-slate-900 dark:text-slate-100 text-sm font-bold flex items-center gap-2">补充说明</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="可详细说明宠物的性格、身体状况、或者是更详细的领养条件..." className="w-full bg-white dark:bg-stone-800 border-0 ring-1 ring-stone-200 dark:ring-stone-700 focus:ring-2 focus:ring-[#ee9d2b] rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-stone-400 outline-none resize-none"></textarea>
            </div>
          </div>
        )}

        {/* --- FOUND PET FIELDS --- */}
        {postType === 'found' && (
          <div className="px-4 py-2 space-y-5 animate-in fade-in duration-300">
            <div className="space-y-3">
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#ee9d2b]" />
                捡到地点
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={locationStr}
                  onChange={(e) => setLocationStr(e.target.value)}
                  placeholder="选择或输入捡到宠物的具体位置"
                  className="w-full bg-white dark:bg-stone-800 border-0 ring-1 ring-stone-200 dark:ring-stone-700 focus:ring-2 focus:ring-[#ee9d2b] rounded-xl px-4 py-3 pl-11 text-slate-900 dark:text-slate-100 placeholder:text-stone-400 outline-none"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"><Search className="w-5 h-5" /></div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ee9d2b]"><Map className="w-5 h-5" /></div>
              </div>
              <div className="mt-2 w-full h-24 rounded-lg bg-stone-100 dark:bg-stone-800 overflow-hidden relative">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj_hG8soBDXptVjTQSAWrbhtWR19NZkz6yRncruKI_AEtIn1Wp5n4d7IAccGvxQ_zbxjpr7kU6NC1zkoTA0Nb9IYXr5ACVHHtmowWFh18Bt3tJ8hFi6k7QcuiZXdpza_UMWY7K-yFHl6g-_1yt_Cxp-icwM6aKvG--t_mILbyf-WlTE1TU6QA-TlXqT2kGgJvlRddO-zASR92yOQQUY93vECtToifKgD_1zAxTwE_exhs4Q7WsdXGP2ELArTkvICF5zqxgN53hpSF7" alt="Map preview" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><MapPin className="w-8 h-8 text-[#ee9d2b] drop-shadow-md" /></div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold flex items-center gap-2">
                <span className="text-[#ee9d2b] text-xl">🔍</span>
                明显特征/项圈
              </h3>
              <input type="text" placeholder="例：红色防跳蚤项圈、右前脚有白毛..." className="w-full bg-white dark:bg-stone-800 border-0 ring-1 ring-stone-200 dark:ring-stone-700 focus:ring-2 focus:ring-[#ee9d2b] rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-stone-400 outline-none" />
            </div>

            <div className="space-y-2">
              <span className="text-slate-900 dark:text-slate-100 text-sm font-bold flex items-center gap-2">捡到时的情况与目前安置点</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="请描述捡到的时间、宠物健康状态，以及它目前由谁暂养（例：目前暂放在小区保安亭/已带回家）..." className="w-full bg-white dark:bg-stone-800 border-0 ring-1 ring-stone-200 dark:ring-stone-700 focus:ring-2 focus:ring-[#ee9d2b] rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-stone-400 outline-none resize-none"></textarea>
            </div>
          </div>
        )}

        {/* --- LOST PET FIELDS --- */}
        {postType === 'lost' && (
          <div className="px-4 py-2 space-y-5 animate-in fade-in duration-300">
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-900 dark:text-slate-100 text-base font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#ee9d2b]" />
                  丢失位置信息
                </span>
                <button className="text-xs text-[#ee9d2b] font-medium flex items-center gap-0.5">
                  <MapPin className="w-4 h-4" />自动定位
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={locationStr}
                  onChange={(e) => setLocationStr(e.target.value)}
                  placeholder="选择或输入丢失地点"
                  className="w-full bg-white dark:bg-stone-800 border-0 ring-1 ring-stone-200 dark:ring-stone-700 focus:ring-2 focus:ring-[#ee9d2b] rounded-xl px-4 py-3 pl-11 text-slate-900 dark:text-slate-100 placeholder:text-stone-400 outline-none"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"><Search className="w-5 h-5" /></div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ee9d2b]"><Map className="w-5 h-5" /></div>
              </div>
              <div className="mt-2 w-full h-24 rounded-lg bg-stone-100 dark:bg-stone-800 overflow-hidden relative">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj_hG8soBDXptVjTQSAWrbhtWR19NZkz6yRncruKI_AEtIn1Wp5n4d7IAccGvxQ_zbxjpr7kU6NC1zkoTA0Nb9IYXr5ACVHHtmowWFh18Bt3tJ8hFi6k7QcuiZXdpza_UMWY7K-yFHl6g-_1yt_Cxp-icwM6aKvG--t_mILbyf-WlTE1TU6QA-TlXqT2kGgJvlRddO-zASR92yOQQUY93vECtToifKgD_1zAxTwE_exhs4Q7WsdXGP2ELArTkvICF5zqxgN53hpSF7" alt="Map preview" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><MapPin className="w-8 h-8 text-[#ee9d2b] drop-shadow-md" /></div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-slate-900 dark:text-slate-100 text-base font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#ee9d2b]" />详细描述
              </span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="请详细描述宠物的特征，如：品种、颜色、体型、走失时的具体情况等..." className="w-full bg-white dark:bg-stone-800 border-0 ring-1 ring-stone-200 dark:ring-stone-700 focus:ring-2 focus:ring-[#ee9d2b] rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-stone-400 outline-none resize-none"></textarea>
            </div>
          </div>
        )}

        {/* --- COMMON CONTACT INFO (All Tabs) --- */}
        <div className="px-4 py-2 space-y-3 mb-4">
          <label className="block">
            <span className="text-slate-900 dark:text-slate-100 text-base font-bold mb-1.5 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#ee9d2b]" />
              联系方式
            </span>
            <div className="relative">
              <input
                type="tel"
                placeholder="请输入手机号码或微信号"
                className="w-full bg-white dark:bg-stone-800 border-0 ring-1 ring-stone-200 dark:ring-stone-700 focus:ring-2 focus:ring-[#ee9d2b] rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-stone-400 outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" className="rounded border-stone-300 text-[#ee9d2b] focus:ring-[#ee9d2b] h-4 w-4" />
                  <span className="text-xs text-stone-500">仅注册用户可见</span>
                </label>
              </div>
            </div>
            <p className="text-xs text-stone-400 mt-1 pl-1">我们会保护您的隐私，号码不会被公开爬取。</p>
          </label>
        </div>

        {/* --- REWARD (Lost Pet Only) --- */}
        {postType === 'lost' && (
          <div className="px-4 py-2 space-y-3 mb-6">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-500">
                  <span className="font-bold">¥</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">提供悬赏金</span>
                  <span className="text-xs text-stone-500">提高寻回概率</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={hasReward} onChange={() => setHasReward(!hasReward)} />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#ee9d2b]"></div>
              </label>
            </div>

            {hasReward && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">¥</div>
                <input
                  type="number"
                  placeholder="请输入悬赏金额"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                  className="w-full bg-white dark:bg-stone-800 border-0 ring-1 ring-stone-200 dark:ring-stone-700 focus:ring-2 focus:ring-[#ee9d2b] rounded-xl px-4 py-3 pl-8 text-slate-900 dark:text-slate-100 placeholder:text-stone-400 outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Empty space at the bottom to ensure content doesn't get hidden behind the fixed button */}
        <div className="h-24"></div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 p-4 pb-8 z-50">
        <button disabled={isSubmitting} onClick={handlePublish} className="w-full flex items-center justify-center gap-2 bg-[#ee9d2b] hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-lg h-14 rounded-2xl shadow-lg shadow-[#ee9d2b]/20 active:scale-[0.98] transition-all">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>立即发布 <Send className="w-5 h-5" /></>}
        </button>
      </div>
    </div>
  );
}
