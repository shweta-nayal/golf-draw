-- ============ ENUMS ============
create type public.app_role as enum ('admin', 'subscriber');
create type public.plan_type as enum ('monthly', 'yearly');
create type public.subscription_status as enum ('active', 'inactive', 'cancelled', 'lapsed');
create type public.draw_logic as enum ('random', 'algorithmic');
create type public.match_tier as enum ('match_3', 'match_4', 'match_5');
create type public.payout_status as enum ('pending', 'paid');
create type public.verification_status as enum ('not_required', 'pending', 'approved', 'rejected');

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  charity_id uuid,
  charity_percent numeric(5,2) default 10 check (charity_percent >= 10 and charity_percent <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- ============ USER ROLES ============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- ============ CHARITIES ============
create table public.charities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text,
  description text,
  image_url text,
  category text,
  featured boolean default false,
  upcoming_event text,
  created_at timestamptz not null default now()
);
alter table public.charities enable row level security;

alter table public.profiles add constraint profiles_charity_fk
  foreign key (charity_id) references public.charities(id) on delete set null;

-- ============ SUBSCRIPTIONS ============
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan plan_type not null,
  status subscription_status not null default 'active',
  amount_inr numeric(10,2) not null,
  charity_percent numeric(5,2) not null default 10,
  charity_id uuid references public.charities(id),
  started_at timestamptz not null default now(),
  renews_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;

-- ============ SCORES ============
create table public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  score int not null check (score between 1 and 45),
  played_on date not null,
  created_at timestamptz not null default now(),
  unique(user_id, played_on)
);
alter table public.scores enable row level security;

-- Trigger: keep only the 5 newest scores per user
create or replace function public.enforce_five_scores()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  delete from public.scores
  where id in (
    select id from public.scores
    where user_id = new.user_id
    order by played_on desc, created_at desc
    offset 5
  );
  return new;
end;
$$;
create trigger trg_enforce_five_scores
after insert on public.scores
for each row execute function public.enforce_five_scores();

-- ============ DRAWS ============
create table public.draws (
  id uuid primary key default gen_random_uuid(),
  draw_month date not null unique,
  logic draw_logic not null default 'random',
  winning_numbers int[] not null,
  pool_total_inr numeric(12,2) not null default 0,
  rollover_in_inr numeric(12,2) not null default 0,
  rollover_out_inr numeric(12,2) not null default 0,
  is_published boolean not null default false,
  is_simulation boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.draws enable row level security;

-- ============ WINNERS ============
create table public.winners (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references public.draws(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  tier match_tier not null,
  matched_count int not null,
  prize_inr numeric(12,2) not null,
  payout_status payout_status not null default 'pending',
  verification_status verification_status not null default 'pending',
  proof_url text,
  created_at timestamptz not null default now()
);
alter table public.winners enable row level security;

-- ============ TIMESTAMPS HELPER ============
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger trg_profiles_updated before update on public.profiles
for each row execute function public.set_updated_at();

-- ============ AUTO PROFILE + ROLE ON SIGNUP ============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  insert into public.user_roles (user_id, role) values (new.id, 'subscriber');
  return new;
end;
$$;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============ RLS POLICIES ============
-- profiles: own
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);
create policy "admin profile select" on public.profiles for select using (public.has_role(auth.uid(), 'admin'));
create policy "admin profile update" on public.profiles for update using (public.has_role(auth.uid(), 'admin'));

-- user_roles: read own, admin all
create policy "own roles select" on public.user_roles for select using (auth.uid() = user_id);
create policy "admin roles all" on public.user_roles for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- charities: public read, admin write
create policy "charities public read" on public.charities for select using (true);
create policy "charities admin write" on public.charities for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- subscriptions: own, admin all
create policy "own subs select" on public.subscriptions for select using (auth.uid() = user_id);
create policy "own subs insert" on public.subscriptions for insert with check (auth.uid() = user_id);
create policy "own subs update" on public.subscriptions for update using (auth.uid() = user_id);
create policy "admin subs all" on public.subscriptions for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- scores: own, admin all
create policy "own scores select" on public.scores for select using (auth.uid() = user_id);
create policy "own scores insert" on public.scores for insert with check (auth.uid() = user_id);
create policy "own scores update" on public.scores for update using (auth.uid() = user_id);
create policy "own scores delete" on public.scores for delete using (auth.uid() = user_id);
create policy "admin scores all" on public.scores for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- draws: published readable by all auth, admin all
create policy "draws read published" on public.draws for select using (is_published = true or public.has_role(auth.uid(), 'admin'));
create policy "draws admin all" on public.draws for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- winners: own, admin all
create policy "own winners select" on public.winners for select using (auth.uid() = user_id);
create policy "own winners update proof" on public.winners for update using (auth.uid() = user_id);
create policy "admin winners all" on public.winners for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
