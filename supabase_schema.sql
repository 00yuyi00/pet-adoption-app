-- ==========================================
-- 0. 清理旧表 (适用于重复执行脚本时，防止报错)
-- ==========================================
drop table if exists public.guides cascade;
drop table if exists public.messages cascade;
drop table if exists public.applications cascade;
drop table if exists public.favorites cascade;
drop table if exists public.pets cascade;
drop table if exists public.profiles cascade;

-- 1. Create Profiles Table (Tied to Auth Users - 也就是用户表)
create table
  public.profiles (
    id uuid not null references auth.users on delete cascade,
    name text null,
    avatar_url text null,
    phone text null, -- 手机号
    bio text null, -- 个人简介
    created_at timestamp with time zone not null default now(),
    constraint profiles_pkey primary key (id)
  );

-- Enable RLS for Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 2. Create Pets Table (宠物发布表)
create table
  public.pets (
    id uuid not null default gen_random_uuid (),
    user_id uuid null references public.profiles (id) on delete cascade,
    post_type text not null, -- 'adopt', 'lost', 'found'
    category text not null, -- 'dog', 'cat', 'other'
    name text not null,
    description text null,
    location text null,
    image_url text null,
    gender text null,
    age text null,
    breed text null,
    status text null,
    reward text null,
    created_at timestamp with time zone not null default now(),
    constraint pets_pkey primary key (id)
  );

-- Enable RLS for Pets
alter table public.pets enable row level security;
create policy "Pets are viewable by everyone." on pets for select using (true);
create policy "Authenticated users can create pets." on pets for insert with check (auth.role() = 'authenticated');
create policy "Users can update own pets." on pets for update using (auth.uid() = user_id);
create policy "Users can delete own pets." on pets for delete using (auth.uid() = user_id);

-- 3. Create Favorites Table (收藏关联表)
create table
  public.favorites (
    user_id uuid not null references public.profiles (id) on delete cascade,
    pet_id uuid not null references public.pets (id) on delete cascade,
    created_at timestamp with time zone not null default now(),
    constraint favorites_pkey primary key (user_id, pet_id)
  );

-- Enable RLS for Favorites
alter table public.favorites enable row level security;
create policy "Users can view own favorites." on favorites for select using (auth.uid() = user_id);
create policy "Users can insert own favorites." on favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete own favorites." on favorites for delete using (auth.uid() = user_id);

-- 4. Create Applications Table (领养人/领养申请数据表)
create table
  public.applications (
    id uuid not null default gen_random_uuid (),
    pet_id uuid not null references public.pets (id) on delete cascade,
    applicant_id uuid not null references public.profiles (id) on delete cascade, -- 申请人 (领养人)
    owner_id uuid not null references public.profiles (id) on delete cascade, -- 宠物发布人
    status text not null default 'pending', -- 'pending'待审核, 'approved'通过, 'rejected'拒绝
    message text null, -- 申请留言
    contact_info text null, -- 联系方式(微信号/手机号)
    has_experience boolean default false, -- 是否有养宠经验
    has_closed_balcony boolean default false, -- 是否已封窗
    accept_visit boolean default false, -- 是否接受视频回访
    created_at timestamp with time zone not null default now(),
    constraint applications_pkey primary key (id)
  );

-- Enable RLS for Applications
alter table public.applications enable row level security;
create policy "Users can view their own applications (as applicant)." on applications for select using (auth.uid() = applicant_id);
create policy "Owners can view applications for their pets." on applications for select using (auth.uid() = owner_id);
create policy "Authenticated users can create applications." on applications for insert with check (auth.role() = 'authenticated');
create policy "Owners can update application status." on applications for update using (auth.uid() = owner_id);

-- 5. Create Messages Table (私信/聊天消息表)
create table
  public.messages (
    id uuid not null default gen_random_uuid (),
    sender_id uuid not null references public.profiles (id) on delete cascade,
    receiver_id uuid not null references public.profiles (id) on delete cascade,
    pet_id uuid null references public.pets (id) on delete set null, -- 可选：关联到具体的某只宠物详情
    content text not null,
    msg_type text not null default 'text', -- 消息类型: 'text', 'image', 'voice'
    is_read boolean default false, -- 是否已读
    created_at timestamp with time zone not null default now(),
    constraint messages_pkey primary key (id)
  );

-- Enable RLS for Messages
alter table public.messages enable row level security;
create policy "Users can view their own messages." on messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can insert messages sender." on messages for insert with check (auth.uid() = sender_id);
create policy "Receivers can update msg read status." on messages for update using (auth.uid() = receiver_id);

-- 6. Create Guides Table (指南/文章表)
create table
  public.guides (
    id uuid not null default gen_random_uuid (),
    category text not null, -- 'dog_guide', 'cat_guide'
    title text not null,
    content text not null,
    cover_url text null,
    created_at timestamp with time zone not null default now(),
    constraint guides_pkey primary key (id)
  );

-- Enable RLS for Guides (Read Only for public)
alter table public.guides enable row level security;
create policy "Guides are viewable by everyone." on guides for select using (true);


-- ==========================================
-- TRIGGER TO AUTO-CREATE PROFILE ON SIGNUP
-- ==========================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', '新宠友_' || substr(new.id::text, 1, 6)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/notionists/svg?seed=' || new.id)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- SEED DATA (Mock Pets and Guides to get started)
-- ==========================================

-- Seed Guides
insert into public.guides (category, title, content, cover_url)
values
  ('dog_guide', '狗狗接回家第一天该做什么？', '准备好航空箱、狗粮，不要急着洗澡，让它先熟悉环境...', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQmX4_...'),
  ('cat_guide', '猫咪接回家不要马上抱它', '猫咪应激反应大，给他准备一个暗处的纸箱，放好水和粮...', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqnK...');
