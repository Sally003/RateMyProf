-- ========================================================
-- CampusRate Platform — Supabase PostgreSQL Database Schema
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COLLEGES TABLE
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(college_id, name)
);

-- 3. PROFILES TABLE (Internal user details — never exposed publicly)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    year_of_study TEXT CHECK (year_of_study IN ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Alumni')),
    verification_level TEXT DEFAULT 'unverified' CHECK (verification_level IN ('unverified', 'email_verified', 'faculty_verified')),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PROFESSORS TABLE
CREATE TABLE IF NOT EXISTS public.professors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    profile_url TEXT,
    verification_status TEXT DEFAULT 'Community Submitted' CHECK (verification_status IN ('Official Source Verified', 'Faculty Verified', 'Community Submitted', 'Pending Verification')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    course_code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(college_id, course_code)
);

-- 6. PROFESSOR COURSES MAPPING TABLE
CREATE TABLE IF NOT EXISTS public.professor_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professor_id UUID NOT NULL REFERENCES public.professors(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    semester TEXT NOT NULL CHECK (semester IN ('Fall', 'Spring', 'Summer', 'Winter')),
    academic_year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(professor_id, course_id, semester, academic_year)
);

-- 7. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    professor_id UUID NOT NULL REFERENCES public.professors(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    teaching_rating SMALLINT NOT NULL CHECK (teaching_rating BETWEEN 1 AND 5),
    marking_rating SMALLINT NOT NULL CHECK (marking_rating BETWEEN 1 AND 5),
    communication_rating SMALLINT NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
    approachability_rating SMALLINT NOT NULL CHECK (approachability_rating BETWEEN 1 AND 5),
    difficulty_rating SMALLINT NOT NULL CHECK (difficulty_rating BETWEEN 1 AND 5),
    would_take_again BOOLEAN NOT NULL DEFAULT TRUE,
    review_text TEXT NOT NULL CHECK (char_length(review_text) >= 10 AND char_length(review_text) <= 2000),
    semester TEXT NOT NULL CHECK (semester IN ('Fall', 'Spring', 'Summer', 'Winter')),
    academic_year INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
    credibility_score NUMERIC(5,2) DEFAULT 75.00,
    risk_score NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Strict Duplicate Prevention constraint per user/professor/course/term
    CONSTRAINT unique_user_prof_course_term UNIQUE(user_id, professor_id, course_id, semester, academic_year)
);

-- 8. REVIEW REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.review_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL CHECK (reason IN ('Spam', 'Abusive', 'Personal attack', 'Personal info', 'Suspected fake', 'Other')),
    details TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'dismissed', 'action_taken')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PROFESSOR REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.professor_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    source_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_professors_college ON public.professors(college_id);
CREATE INDEX IF NOT EXISTS idx_professors_dept ON public.professors(department_id);
CREATE INDEX IF NOT EXISTS idx_reviews_prof ON public.reviews(professor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_courses_college ON public.courses(college_id);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (ANONYMITY & SECURITY)
-- ========================================================

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professor_requests ENABLE ROW LEVEL SECURITY;

-- Public Read for Catalog Data
CREATE POLICY "Public Read Colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Public Read Departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Public Read Professors" ON public.professors FOR SELECT USING (true);
CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (true);

-- User Profiles (Strict User Isolation)
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews (Public Reads Approved Reviews, Auth Users Insert Own)
CREATE POLICY "Public view approved reviews" ON public.reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users insert own review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own review" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Reports & Requests
CREATE POLICY "Auth users insert report" ON public.review_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own reports" ON public.review_reports FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Auth users submit request" ON public.professor_requests FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Users view own requests" ON public.professor_requests FOR SELECT USING (auth.uid() = submitted_by);
