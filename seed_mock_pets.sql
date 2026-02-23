-- ==========================================
-- Insert Mock Users locally into auth.users (required for the profiles foreign key constraint)
-- Note: This is a hacky way to force data into Supabase's auth.users directly. 
-- Usually users are created via the app signup flow, but this helps seed mock data easily.
-- ==========================================

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'userA@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "测试用户A", "avatar_url": "https://api.dicebear.com/7.x/notionists/svg?seed=userA"}', now(), now(), '', '', '', ''),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'station@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "流浪动物救助站", "avatar_url": "https://api.dicebear.com/7.x/notionists/svg?seed=station"}', now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- Note: The trigger "handle_new_user" might automatically create profiles when we insert into auth.users.
-- We do an UPDATE here to ensure the phones and is_admin flags are set just in case the trigger fired.
UPDATE public.profiles SET phone = '13800000001', is_admin = false WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE public.profiles SET phone = '13800000002', is_admin = false WHERE id = '22222222-2222-2222-2222-222222222222';

-- If the trigger did not fire for some reason (e.g. disabled locally), we insert manually:
INSERT INTO public.profiles (id, name, avatar_url, phone, is_admin)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '测试用户A', 'https://api.dicebear.com/7.x/notionists/svg?seed=userA', '13800000001', false),
  ('22222222-2222-2222-2222-222222222222', '流浪动物救助站', 'https://api.dicebear.com/7.x/notionists/svg?seed=station', '13800000002', false)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- Insert Mock Pets (待领养)
-- ==========================================
INSERT INTO public.pets (id, user_id, post_type, category, name, description, location, image_url, gender, age, breed, status)
VALUES
  (
    '10000000-0000-0000-0000-000000000001', 
    '22222222-2222-2222-2222-222222222222', 
    'adopt', 'cat', '橘子', '性格极品好，随意呼噜踩奶。已经被绝育，疫苗全。限同城有养宠经验者。', 
    '上海市 浦东新区', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800', 
    'female', '1.5岁', '中华田园橘猫', '已绝育'
  ),
  (
    '10000000-0000-0000-0000-000000000002', 
    '22222222-2222-2222-2222-222222222222', 
    'adopt', 'dog', '旺财', '在小区地下车库救助的流浪狗，非常亲人，会在尿垫上厕所。', 
    '上海市 闵行区', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800', 
    'male', '8个月', '中华田园犬', '未绝育'
  ),
  (
     '10000000-0000-0000-0000-000000000005', 
    '11111111-1111-1111-1111-111111111111', 
    'adopt', 'cat', '煤球', '黑色的英短，因个人工作变动无法继续饲养，寻找有缘人，要求封窗。', 
    '北京市 朝阳区', 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&q=80&w=800', 
    'male', '2岁', '英国短毛猫', '已绝育'
  )
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- Insert Mock Pets (寻宠)
-- ==========================================
INSERT INTO public.pets (id, user_id, post_type, category, name, description, location, image_url, gender, age, breed, status, reward)
VALUES
  (
    '10000000-0000-0000-0000-000000000003', 
    '11111111-1111-1111-1111-111111111111', 
    'lost', 'dog', '豆豆', '白色比熊，带着黄色带有铃铛的项圈。昨晚在公园走丢，如有好心人看到请务必联系我！', 
    '上海市 静安区 中心公园', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800', 
    'male', '3岁', '比熊犬', '走失中', '¥2000'
  ),
  (
    '10000000-0000-0000-0000-000000000004', 
    '11111111-1111-1111-1111-111111111111', 
    'found', 'cat', '未知狸花', '昨晚下雨在小区绿化带捡到的一只狸花猫，看起来很干净应该是刚走丢的家猫。目前暂存在小区保安室。', 
    '深圳市 南山区 xxx小区', 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dffa?auto=format&fit=crop&q=80&w=800', 
    'unknown', '未知', '狸花猫', '被寻获' , null
  )
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- Insert Mock Applications (If your auth user has id, you won't be able to see these unless we trick the owner_id or applicant_id, so we just prep them to show in Admin view)
-- ==========================================
INSERT INTO public.applications (pet_id, applicant_id, owner_id, status, message, contact_info, has_experience, has_closed_balcony)
VALUES
  ('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'pending', '我很喜欢小橘，已经买好了全套用品。', 'wx_test123', true, true),
  ('10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'approved', '之前养过狗，家里也是一楼有个小院子，很适合狗狗活动。', '13911112222', true, false)
ON CONFLICT DO NOTHING;
