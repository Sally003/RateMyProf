import { supabase, isSupabaseConfigured } from './supabaseClient';
import neCollegesData from './northeast_institutions.json';
import inCollegesData from './indian_institutions.json';

// Process crawled Northeastern institutions
const NE_COLLEGES = neCollegesData.map(c => ({
  id: c.id,
  name: c.name,
  city: c.city,
  state: c.state,
  website: c.website,
  badge: c.badge || 'Northeast Premier',
  departmentsCount: c.departmentsCount || 10,
  professorsCount: c.professorsCount || 40
}));

const NE_DEPARTMENTS = [];
const NE_COURSES = [];
const NE_PROFESSORS = [];
const NE_REVIEWS = [];

neCollegesData.forEach((col, idx) => {
  (col.departments || ['Computer Science', 'Electronics']).forEach((deptName, dIdx) => {
    const deptId = `dept-ne-${idx}-${dIdx}`;
    NE_DEPARTMENTS.push({ id: deptId, collegeId: col.id, name: deptName });
    NE_COURSES.push({
      id: `crs-ne-${idx}-${dIdx}`,
      collegeId: col.id,
      departmentId: deptId,
      courseCode: `${deptName.substring(0, 3).toUpperCase()}101`,
      name: `Introductory ${deptName}`
    });
  });

  (col.professors || []).forEach((p, pIdx) => {
    const profId = `prof-ne-${idx}-${pIdx}`;
    const dept = NE_DEPARTMENTS.find(d => d.collegeId === col.id && d.name === p.department) || NE_DEPARTMENTS[0];
    const deptId = dept ? dept.id : `dept-ne-${idx}-0`;
    
    NE_PROFESSORS.push({
      id: profId,
      collegeId: col.id,
      collegeName: col.name.split(' (')[0],
      departmentId: deptId,
      departmentName: p.department || 'Computer Science',
      name: p.name,
      designation: p.designation || 'Professor',
      profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      verificationStatus: 'Official Source Verified',
      bio: p.bio || 'Faculty member extracted from university directory.'
    });

    NE_REVIEWS.push({
      id: `rev-ne-${idx}-${pIdx}`,
      profId: profId,
      courseId: `crs-ne-${idx}-0`,
      courseName: p.course || `${p.department} Core`,
      teachingRating: 5,
      markingRating: 4,
      communicationRating: 5,
      approachabilityRating: 5,
      difficultyRating: 4,
      wouldTakeAgain: true,
      reviewText: `Prof. ${p.name.split(' ').slice(-1)[0]} is one of the most respected faculty members at ${col.name}. Clear explanations and research guidance!`,
      semester: 'Fall',
      academicYear: 2025,
      status: 'approved',
      credibilityLabel: 'Verified Student',
      credibilityScore: 95.0,
      riskScore: 0.0,
      createdAt: '2025-11-15T10:00:00Z'
    });
  });
});

// Process crawled Pan-India institutions
const IN_COLLEGES = inCollegesData.map(c => ({
  id: c.id,
  name: c.name,
  city: c.city,
  state: c.state,
  website: c.website,
  badge: c.badge || 'Premier Institution',
  departmentsCount: c.departmentsCount || 15,
  professorsCount: c.professorsCount || 60
}));

const IN_DEPARTMENTS = [];
const IN_COURSES = [];
const IN_PROFESSORS = [];
const IN_REVIEWS = [];

inCollegesData.forEach((col, idx) => {
  (col.departments || ['Computer Science', 'Electronics']).forEach((deptName, dIdx) => {
    const deptId = `dept-in-crawl-${idx}-${dIdx}`;
    IN_DEPARTMENTS.push({ id: deptId, collegeId: col.id, name: deptName });
    IN_COURSES.push({
      id: `crs-in-crawl-${idx}-${dIdx}`,
      collegeId: col.id,
      departmentId: deptId,
      courseCode: `${deptName.substring(0, 3).toUpperCase()}201`,
      name: `Advanced ${deptName}`
    });
  });

  (col.professors || []).forEach((p, pIdx) => {
    const profId = `prof-in-crawl-${idx}-${pIdx}`;
    const dept = IN_DEPARTMENTS.find(d => d.collegeId === col.id && d.name === p.department) || IN_DEPARTMENTS[0];
    const deptId = dept ? dept.id : `dept-in-crawl-${idx}-0`;
    
    IN_PROFESSORS.push({
      id: profId,
      collegeId: col.id,
      collegeName: col.name.split(' (')[0],
      departmentId: deptId,
      departmentName: p.department || 'Computer Science',
      name: p.name,
      designation: p.designation || 'Professor',
      profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      verificationStatus: 'Official Source Verified',
      bio: p.bio || 'Faculty member extracted from university directory.'
    });

    IN_REVIEWS.push({
      id: `rev-in-crawl-${idx}-${pIdx}`,
      profId: profId,
      courseId: `crs-in-crawl-${idx}-0`,
      courseName: p.course || `${p.department} Core`,
      teachingRating: 5,
      markingRating: 4,
      communicationRating: 5,
      approachabilityRating: 5,
      difficultyRating: 4,
      wouldTakeAgain: true,
      reviewText: `Prof. ${p.name.split(' ').slice(-1)[0]} is widely acclaimed for outstanding lectures at ${col.name}. Highly recommended!`,
      semester: 'Spring',
      academicYear: 2025,
      status: 'approved',
      credibilityLabel: 'Verified Student',
      credibilityScore: 96.0,
      riskScore: 0.0,
      createdAt: '2025-11-20T10:00:00Z'
    });
  });
});

// INITIAL SEED DATA FOR DEMO & FALLBACK RUNTIME
const SEED_COLLEGES = [
  ...IN_COLLEGES,
  ...NE_COLLEGES,
  {
    id: 'col-in-1',
    name: 'Indian Institute of Technology Bombay (IIT Bombay)',
    city: 'Mumbai',
    state: 'Maharashtra',
    website: 'https://iitb.ac.in',
    badge: 'Institute of Eminence',
    departmentsCount: 16,
    professorsCount: 68
  },
  {
    id: 'col-in-2',
    name: 'Indian Institute of Technology Delhi (IIT Delhi)',
    city: 'New Delhi',
    state: 'Delhi',
    website: 'https://iitd.ac.in',
    badge: 'Institute of Eminence',
    departmentsCount: 15,
    professorsCount: 62
  },
  {
    id: 'col-in-3',
    name: 'Indian Institute of Science (IISc Bengaluru)',
    city: 'Bengaluru',
    state: 'Karnataka',
    website: 'https://iisc.ac.in',
    badge: 'Premier Research',
    departmentsCount: 22,
    professorsCount: 85
  },
  {
    id: 'col-in-4',
    name: 'Indian Institute of Technology Madras (IIT Madras)',
    city: 'Chennai',
    state: 'Tamil Nadu',
    website: 'https://iitm.ac.in',
    badge: 'NIRF #1 Overall',
    departmentsCount: 17,
    professorsCount: 74
  },
  {
    id: 'col-in-5',
    name: 'BITS Pilani',
    city: 'Pilani',
    state: 'Rajasthan',
    website: 'https://bits-pilani.ac.in',
    badge: 'Private Eminence',
    departmentsCount: 14,
    professorsCount: 52
  },
  {
    id: 'col-in-6',
    name: 'Indian Institute of Management Ahmedabad (IIM Ahmedabad)',
    city: 'Ahmedabad',
    state: 'Gujarat',
    website: 'https://iima.ac.in',
    badge: 'Premier Business School',
    departmentsCount: 8,
    professorsCount: 36
  },
  {
    id: 'col-1',
    name: 'Stanford University',
    city: 'Stanford',
    state: 'CA',
    website: 'https://stanford.edu',
    badge: 'Tier 1 Research',
    departmentsCount: 14,
    professorsCount: 42
  },
  {
    id: 'col-2',
    name: 'Massachusetts Institute of Technology',
    city: 'Cambridge',
    state: 'MA',
    website: 'https://mit.edu',
    badge: 'STEM Leadership',
    departmentsCount: 12,
    professorsCount: 38
  },
  {
    id: 'col-3',
    name: 'University of California, Berkeley',
    city: 'Berkeley',
    state: 'CA',
    website: 'https://berkeley.edu',
    badge: 'Public Flagship',
    departmentsCount: 18,
    professorsCount: 56
  }
];

const SEED_DEPARTMENTS = [
  ...IN_DEPARTMENTS,
  ...NE_DEPARTMENTS,
  { id: 'dept-in-1', collegeId: 'col-in-1', name: 'Computer Science & Engineering' },
  { id: 'dept-in-2', collegeId: 'col-in-1', name: 'Electrical Engineering' },
  { id: 'dept-in-3', collegeId: 'col-in-2', name: 'Computer Science & Engineering' },
  { id: 'dept-in-4', collegeId: 'col-in-3', name: 'Computer Science & Automation (CSA)' },
  { id: 'dept-in-5', collegeId: 'col-in-4', name: 'Computer Science & Engineering' },
  { id: 'dept-in-6', collegeId: 'col-in-5', name: 'Computer Science & Information Systems' },
  { id: 'dept-in-7', collegeId: 'col-in-6', name: 'Finance & Accounting' },
  { id: 'dept-1', collegeId: 'col-1', name: 'Computer Science' },
  { id: 'dept-2', collegeId: 'col-1', name: 'Economics' },
  { id: 'dept-4', collegeId: 'col-2', name: 'Computer Science & AI' },
  { id: 'dept-6', collegeId: 'col-3', name: 'Computer Science' }
];

const SEED_COURSES = [
  ...IN_COURSES,
  ...NE_COURSES,
  { id: 'crs-in-101', collegeId: 'col-in-1', departmentId: 'dept-in-1', courseCode: 'CS101', name: 'Computer Programming & Utilization' },
  { id: 'crs-in-102', collegeId: 'col-in-1', departmentId: 'dept-in-1', courseCode: 'CS213', name: 'Data Structures & Algorithms' },
  { id: 'crs-in-103', collegeId: 'col-in-2', departmentId: 'dept-in-3', courseCode: 'COL106', name: 'Data Structures & Algorithms' },
  { id: 'crs-in-104', collegeId: 'col-in-3', departmentId: 'dept-in-4', courseCode: 'E0 259', name: 'Data Analytics & Machine Learning' },
  { id: 'crs-in-105', collegeId: 'col-in-4', departmentId: 'dept-in-5', courseCode: 'CS2700', name: 'Programming & Data Structures' },
  { id: 'crs-in-106', collegeId: 'col-in-5', departmentId: 'dept-in-6', courseCode: 'CS F211', name: 'Data Structures & Algorithms' },
  { id: 'crs-in-107', collegeId: 'col-in-6', departmentId: 'dept-in-7', courseCode: 'FIN101', name: 'Corporate Finance & Valuation' },
  { id: 'crs-101', collegeId: 'col-1', departmentId: 'dept-1', courseCode: 'CS106B', name: 'Programming Abstractions' },
  { id: 'crs-102', collegeId: 'col-1', departmentId: 'dept-1', courseCode: 'CS229', name: 'Machine Learning' },
  { id: 'crs-104', collegeId: 'col-2', departmentId: 'dept-4', courseCode: '6.0001', name: 'Intro to CS in Python' }
];

const SEED_PROFESSORS = [
  ...IN_PROFESSORS,
  ...NE_PROFESSORS,
  {
    id: 'prof-in-1',
    collegeId: 'col-in-1',
    collegeName: 'IIT Bombay',
    departmentId: 'dept-in-1',
    departmentName: 'Computer Science & Engineering',
    name: 'Prof. Abhiram G. Ranade',
    designation: 'Professor Emeritus',
    profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    verificationStatus: 'Official Source Verified',
    bio: 'Renowned computer science educator and author of An Introduction to Programming through C++.'
  },
  {
    id: 'prof-in-2',
    collegeId: 'col-in-2',
    collegeName: 'IIT Delhi',
    departmentId: 'dept-in-3',
    departmentName: 'Computer Science & Engineering',
    name: 'Prof. Subhashis Banerjee',
    designation: 'Honorary Professor',
    profileUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    verificationStatus: 'Official Source Verified',
    bio: 'Pioneer in Computer Vision, Machine Learning, and algorithms at IIT Delhi.'
  },
  {
    id: 'prof-in-3',
    collegeId: 'col-in-3',
    collegeName: 'IISc Bengaluru',
    departmentId: 'dept-in-4',
    departmentName: 'Computer Science & Automation',
    name: 'Prof. Chiranjib Bhattacharyya',
    designation: 'Professor & Department Chair',
    profileUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    verificationStatus: 'Faculty Verified',
    bio: 'Leading researcher in Machine Learning, Convex Optimization, and Artificial Intelligence.'
  },
  {
    id: 'prof-in-4',
    collegeId: 'col-in-4',
    collegeName: 'IIT Madras',
    departmentId: 'dept-in-5',
    departmentName: 'Computer Science & Engineering',
    name: 'Prof. V. Kamakoti',
    designation: 'Director & Professor',
    profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    verificationStatus: 'Official Source Verified',
    bio: 'Director of IIT Madras and Chief Architect of India’s indigenous SHAKTI Microprocessor project.'
  },
  {
    id: 'prof-in-5',
    collegeId: 'col-in-5',
    collegeName: 'BITS Pilani',
    departmentId: 'dept-in-6',
    departmentName: 'Computer Science & Information Systems',
    name: 'Dr. Yashvardhan Sharma',
    designation: 'Professor & Head of Department',
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    verificationStatus: 'Faculty Verified',
    bio: 'Specialist in Natural Language Processing, Information Retrieval, and Knowledge Graphs.'
  },
  {
    id: 'prof-in-6',
    collegeId: 'col-in-6',
    collegeName: 'IIM Ahmedabad',
    departmentId: 'dept-in-7',
    departmentName: 'Finance & Accounting',
    name: 'Prof. Jayanth R. Varma',
    designation: 'Professor of Finance',
    profileUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    verificationStatus: 'Official Source Verified',
    bio: 'Former Executive Director of SEBI and leading authority on financial markets, risk management, and valuation.'
  },
  {
    id: 'prof-1',
    collegeId: 'col-1',
    collegeName: 'Stanford University',
    departmentId: 'dept-1',
    departmentName: 'Computer Science',
    name: 'Dr. Andrew Ng',
    designation: 'Adjunct Professor',
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    verificationStatus: 'Official Source Verified',
    bio: 'Pioneer in Machine Learning and Artificial Intelligence Education.'
  },
  {
    id: 'prof-3',
    collegeId: 'col-2',
    collegeName: 'Massachusetts Institute of Technology',
    departmentId: 'dept-4',
    departmentName: 'Computer Science & AI',
    name: 'Prof. Ana Bell',
    designation: 'Senior Lecturer',
    profileUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    verificationStatus: 'Official Source Verified',
    bio: 'Specialist in computational thinking and Python programming.'
  }
];

const SEED_REVIEWS = [
  ...IN_REVIEWS,
  ...NE_REVIEWS,
  {
    id: 'rev-in-1',
    profId: 'prof-in-1',
    courseId: 'crs-in-101',
    courseName: 'CS101 - Computer Programming',
    teachingRating: 5,
    markingRating: 5,
    communicationRating: 5,
    approachabilityRating: 5,
    difficultyRating: 4,
    wouldTakeAgain: true,
    reviewText: 'Prof. Ranade is an absolute icon at IIT Bombay! His intuition for teaching algorithms and graphics in CS101 makes programming effortless and fun.',
    semester: 'Fall',
    academicYear: 2025,
    status: 'approved',
    credibilityLabel: 'Verified Student',
    credibilityScore: 96.0,
    riskScore: 0.0,
    createdAt: '2025-11-20T08:00:00Z'
  },
  {
    id: 'rev-in-2',
    profId: 'prof-in-4',
    courseId: 'crs-in-105',
    courseName: 'CS2700 - Programming & Data Structures',
    teachingRating: 5,
    markingRating: 4,
    communicationRating: 5,
    approachabilityRating: 4,
    difficultyRating: 5,
    wouldTakeAgain: true,
    reviewText: 'Prof. Kamakoti brings real-world chip design insights right into the classroom. His lectures on computer architecture and assembly are top notch.',
    semester: 'Spring',
    academicYear: 2025,
    status: 'approved',
    credibilityLabel: 'Verified Student',
    credibilityScore: 94.0,
    riskScore: 2.0,
    createdAt: '2025-05-18T12:00:00Z'
  },
  {
    id: 'rev-in-3',
    profId: 'prof-in-6',
    courseId: 'crs-in-107',
    courseName: 'FIN101 - Corporate Finance & Valuation',
    teachingRating: 5,
    markingRating: 4,
    communicationRating: 5,
    approachabilityRating: 4,
    difficultyRating: 5,
    wouldTakeAgain: true,
    reviewText: 'Prof. Varma’s financial markets lectures at IIMA are legendary. High workload and demanding exams, but you learn valuation like nowhere else.',
    semester: 'Fall',
    academicYear: 2025,
    status: 'approved',
    credibilityLabel: 'Verified Student',
    credibilityScore: 91.0,
    riskScore: 1.0,
    createdAt: '2025-10-15T15:30:00Z'
  },
  {
    id: 'rev-1',
    profId: 'prof-1',
    courseId: 'crs-102',
    courseName: 'CS229 - Machine Learning',
    teachingRating: 5,
    markingRating: 4,
    communicationRating: 5,
    approachabilityRating: 5,
    difficultyRating: 4,
    wouldTakeAgain: true,
    reviewText: 'Dr. Ng explains linear algebra and neural networks with unparalleled clarity. The problem sets are challenging but rewarding.',
    semester: 'Fall',
    academicYear: 2025,
    status: 'approved',
    credibilityLabel: 'Verified Student',
    credibilityScore: 92.5,
    riskScore: 5.0,
    createdAt: '2025-12-14T10:30:00Z'
  },
  {
    id: 'rev-2',
    profId: 'prof-1',
    courseId: 'crs-102',
    courseName: 'CS229 - Machine Learning',
    teachingRating: 5,
    markingRating: 5,
    communicationRating: 5,
    approachabilityRating: 4,
    difficultyRating: 5,
    wouldTakeAgain: true,
    reviewText: 'Legendary course! Make sure to review multivariate calculus before week 1. Office hours are super helpful.',
    semester: 'Spring',
    academicYear: 2025,
    status: 'approved',
    credibilityLabel: 'Verified Student',
    credibilityScore: 88.0,
    riskScore: 2.0,
    createdAt: '2025-05-20T14:15:00Z'
  },
  {
    id: 'rev-3',
    profId: 'prof-2',
    courseId: 'crs-101',
    courseName: 'CS106B - Programming Abstractions',
    teachingRating: 5,
    markingRating: 4,
    communicationRating: 5,
    approachabilityRating: 5,
    difficultyRating: 3,
    wouldTakeAgain: true,
    reviewText: 'Prof. Sahami is full of high energy and enthusiasm! C++ recursion and memory management make complete sense now.',
    semester: 'Fall',
    academicYear: 2025,
    status: 'approved',
    credibilityLabel: 'Verified Student',
    credibilityScore: 94.0,
    riskScore: 0.0,
    createdAt: '2025-11-28T09:12:00Z'
  },
  {
    id: 'rev-4',
    profId: 'prof-4',
    courseId: 'crs-105',
    courseName: 'CS61A - Structure and Interpretation',
    teachingRating: 5,
    markingRating: 4,
    communicationRating: 5,
    approachabilityRating: 4,
    difficultyRating: 4,
    wouldTakeAgain: true,
    reviewText: 'DeNero is one of the best lecturers at Cal. The Python scheme interpreter project was tough but incredibly enlightening.',
    semester: 'Fall',
    academicYear: 2025,
    status: 'approved',
    credibilityLabel: 'Verified Student',
    credibilityScore: 90.0,
    riskScore: 1.5,
    createdAt: '2025-12-02T18:44:00Z'
  },
  {
    id: 'rev-5',
    profId: 'prof-6',
    courseId: 'crs-106',
    courseName: 'FIN301 - Valuation & Corporate Finance',
    teachingRating: 3,
    markingRating: 2,
    communicationRating: 3,
    approachabilityRating: 2,
    difficultyRating: 5,
    wouldTakeAgain: false,
    reviewText: 'Extremely tough grader! Exams require deep intuition beyond lecture slides.',
    semester: 'Spring',
    academicYear: 2025,
    status: 'pending',
    credibilityLabel: 'Under Review',
    credibilityScore: 65.0,
    riskScore: 45.0,
    createdAt: '2026-02-10T11:20:00Z'
  }
];

// Local Storage Helper Keys
// STORAGE_KEYS is declared below with full keys list

// Initialize LocalStorage Data
function getStoredData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }
}

// SANITIZATION UTILITY FOR XSS / HTML INJECTION MITIGATION
export function sanitizeText(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// DEDUPLICATION UTILITIES
function deduplicateColleges(colleges) {
  if (!Array.isArray(colleges)) return [];
  const seen = new Set();
  return colleges.filter(c => {
    if (!c || !c.name) return false;
    // Normalize name by removing non-alphanumeric chars for matching
    const norm = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(norm)) {
      return false;
    }
    seen.add(norm);
    return true;
  });
}

function deduplicateProfessors(professors) {
  if (!Array.isArray(professors)) return [];
  const seen = new Set();
  return professors.filter(p => {
    if (!p || !p.name) return false;
    const normName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normCol = (p.collegeName || p.collegeId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const key = `${normName}_${normCol}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

const STORAGE_KEYS = {
  ACCOUNTS: 'ratemyproff_user_accounts_v1',
  REVIEWS: 'ratemyproff_reviews_v1',
  REPORTS: 'ratemyproff_reports_v1',
  REQUESTS: 'ratemyproff_requests_v1',
  COLLEGES: 'ratemyproff_colleges_v1',
  COLLEGE_REQUESTS: 'ratemyproff_college_requests_v1',
  PROFESSORS: 'ratemyproff_professors_v1',
  USER: 'ratemyproff_current_user_v1',
  AUDIT_LOGS: 'ratemyproff_audit_logs_v1'
};

const SEED_ACCOUNTS = [
  {
    id: 'usr-admin-1',
    name: 'Lead Administrator',
    email: 'admin@ratemyproff.edu',
    password: 'ADMIN-2026',
    role: 'admin',
    collegeId: 'col-in-1',
    collegeName: 'IIT Bombay',
    departmentId: 'dept-in-1',
    yearOfStudy: 'Faculty Moderator',
    verificationLevel: 'faculty_verified',
    isAdmin: true,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-student-1',
    name: 'Alex Rivera',
    email: 'student@ratemyproff.edu',
    password: 'password123',
    role: 'student',
    collegeId: 'col-in-1',
    collegeName: 'IIT Bombay',
    departmentId: 'dept-in-1',
    yearOfStudy: 'Junior',
    verificationLevel: 'email_verified',
    isAdmin: false,
    createdAt: '2026-01-02T00:00:00Z'
  }
];

const DEFAULT_AUDIT_LOGS = [
  { id: 'log-1', action: 'SYSTEM_BOOT', details: 'RateMyProff security policies & persistent auth database initialized', timestamp: new Date(Date.now() - 3600000).toISOString(), actor: 'System' },
  { id: 'log-2', action: 'DIRECTORY_SYNC', details: 'Indexed 20 Indian & Northeastern universities catalog', timestamp: new Date(Date.now() - 1800000).toISOString(), actor: 'System' }
];

// ----------------------------------------------------
// DATA SERVICE API
// ----------------------------------------------------

export const DataService = {
  // --- PERSISTENT USER & ADMIN ACCOUNTS DATABASE ---
  getAccounts() {
    return getStoredData(STORAGE_KEYS.ACCOUNTS, SEED_ACCOUNTS);
  },

  saveAccounts(accounts) {
    setStoredData(STORAGE_KEYS.ACCOUNTS, accounts);
  },

  getCurrentUser() {
    return getStoredData(STORAGE_KEYS.USER, {
      id: 'usr-student-1',
      name: 'Alex Rivera',
      email: 'student@ratemyproff.edu',
      collegeId: 'col-in-1',
      collegeName: 'IIT Bombay',
      departmentId: 'dept-in-1',
      yearOfStudy: 'Junior',
      verificationLevel: 'email_verified',
      isAdmin: false
    });
  },

  setCurrentUser(userData) {
    setStoredData(STORAGE_KEYS.USER, userData);
    return userData;
  },

  registerAccount({ name, email, password, role = 'student', collegeId, collegeName, departmentId, yearOfStudy, adminKey }) {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid academic or personal email address.');
    }
    if (!password || password.length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }

    const accounts = this.getAccounts();
    const existing = accounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const isAdmin = role === 'admin';
    if (isAdmin) {
      if (adminKey !== 'ADMIN-2026') {
        throw new Error('Invalid Admin Security Passcode. Passcode ADMIN-2026 required for admin registration.');
      }
    }

    const isEdu = email.endsWith('.edu') || email.endsWith('.ac.in') || email.endsWith('.edu.in');

    const newAccount = {
      id: `usr-${Date.now()}`,
      name: sanitizeText(name) || (isAdmin ? 'Admin User' : 'Verified Student'),
      email: email.trim().toLowerCase(),
      password: password,
      role: isAdmin ? 'admin' : 'student',
      collegeId: collegeId || 'col-in-1',
      collegeName: collegeName || 'University',
      departmentId: departmentId || 'dept-in-1',
      yearOfStudy: yearOfStudy || (isAdmin ? 'Faculty Lead' : 'Undergraduate'),
      verificationLevel: isAdmin ? 'faculty_verified' : (isEdu ? 'email_verified' : 'unverified'),
      isAdmin: isAdmin,
      createdAt: new Date().toISOString()
    };

    accounts.unshift(newAccount);
    this.saveAccounts(accounts);
    this.setCurrentUser(newAccount);
    
    if (isAdmin) {
      this.logAdminAction('ADMIN_REGISTERED', `New admin registered: ${email}`);
    } else {
      this.logAdminAction('USER_REGISTERED', `New student registered: ${email}`);
    }

    return newAccount;
  },

  loginAccount({ email, password, portalType }) {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    const accounts = this.getAccounts();
    const account = accounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase());

    if (!account) {
      throw new Error('No account found with this email address. Please register a new account.');
    }

    const isAdminPortal = portalType === 'admin';
    if (isAdminPortal && !account.isAdmin && account.role !== 'admin') {
      throw new Error('This account does not have Admin Privileges. Please login through the Student Portal.');
    }

    if (account.password !== password) {
      throw new Error('Incorrect password or security passcode. Please check your credentials.');
    }

    const sessionUser = {
      ...account,
      isAdmin: account.isAdmin || account.role === 'admin'
    };

    this.setCurrentUser(sessionUser);

    if (sessionUser.isAdmin) {
      this.logAdminAction('ADMIN_LOGIN', `Admin authenticated: ${email}`);
    }

    return sessionUser;
  },

  loginWithCredentials({ name, email, role, adminKey }) {
    return this.loginAccount({ email, password: adminKey || 'password123', portalType: role });
  },

  logout() {
    const guestUser = {
      id: 'usr-student-1',
      name: 'Alex Rivera',
      email: 'student@ratemyproff.edu',
      collegeId: 'col-in-1',
      collegeName: 'IIT Bombay',
      departmentId: 'dept-in-1',
      yearOfStudy: 'Junior',
      verificationLevel: 'email_verified',
      isAdmin: false
    };
    this.setCurrentUser(guestUser);
    return guestUser;
  },

  toggleAdminRole(isAdmin) {
    const user = this.getCurrentUser();
    const updated = { ...user, isAdmin, adminPasscodeVerified: isAdmin };
    this.setCurrentUser(updated);
    if (isAdmin) {
      this.logAdminAction('ROLE_TOGGLED', `User ${user.name} switched to Admin Mode`);
    }
    return updated;
  },

  // --- AUDIT LOGGING ---
  getAuditLogs() {
    return getStoredData(STORAGE_KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
  },

  logAdminAction(action, details) {
    const user = this.getCurrentUser();
    const logs = this.getAuditLogs();
    const newLog = {
      id: `log-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      actor: user ? user.name : 'Admin System'
    };
    logs.unshift(newLog);
    setStoredData(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 50)); // keep last 50
    return newLog;
  },

  // --- COLLEGES & DEPARTMENTS ---
  async getColleges() {
    const raw = getStoredData(STORAGE_KEYS.COLLEGES, SEED_COLLEGES);
    const cleaned = deduplicateColleges(raw);
    if (cleaned.length !== raw.length) {
      setStoredData(STORAGE_KEYS.COLLEGES, cleaned);
    }
    return cleaned;
  },

  async getCollegeById(id) {
    const list = await this.getColleges();
    return list.find(c => c.id === id) || null;
  },

  async getDepartments(collegeId) {
    const list = getStoredData('ratemyproff_departments_v1', SEED_DEPARTMENTS);
    if (!collegeId) return list;
    return list.filter(d => d.collegeId === collegeId);
  },

  async getCourses(collegeId, departmentId) {
    let list = SEED_COURSES;
    if (collegeId) list = list.filter(c => c.collegeId === collegeId);
    if (departmentId) list = list.filter(c => c.departmentId === departmentId);
    return list;
  },

  // --- PROFESSORS ---
  async getProfessors(filters = {}) {
    let list = getStoredData(STORAGE_KEYS.PROFESSORS, SEED_PROFESSORS);
    list = deduplicateProfessors(list);

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.collegeName && p.collegeName.toLowerCase().includes(q)) ||
        (p.departmentName && p.departmentName.toLowerCase().includes(q))
      );
    }

    if (filters.collegeId) {
      list = list.filter(p => p.collegeId === filters.collegeId);
    }

    if (filters.departmentId) {
      list = list.filter(p => p.departmentId === filters.departmentId);
    }

    // Attach computed rating metrics to each professor
    const reviews = getStoredData(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    
    return list.map(prof => {
      const profReviews = reviews.filter(r => r.profId === prof.id && r.status === 'approved');
      const stats = this.computeRatingStats(profReviews);
      return {
        ...prof,
        ...stats,
        totalReviews: profReviews.length
      };
    });
  },

  async getProfessorById(id) {
    const professors = await this.getProfessors();
    const prof = professors.find(p => p.id === id);
    if (!prof) return null;

    const allReviews = getStoredData(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    const profReviews = allReviews.filter(r => r.profId === id && r.status === 'approved');
    const courses = SEED_COURSES.filter(c => c.collegeId === prof.collegeId && c.departmentId === prof.departmentId);

    return {
      ...prof,
      reviews: profReviews,
      courses: courses,
      ratingStats: this.computeRatingStats(profReviews)
    };
  },

  // RATING COMPUTATION ALGORITHM
  // Overall Rating = average of (Teaching, Marking, Communication, Approachability)
  // Difficulty is displayed separately
  computeRatingStats(reviews) {
    if (!reviews || reviews.length === 0) {
      return {
        overallRating: 0.0,
        teachingRating: 0.0,
        markingRating: 0.0,
        communicationRating: 0.0,
        approachabilityRating: 0.0,
        difficultyRating: 0.0,
        wouldTakeAgainPercent: 0,
        reviewCount: 0
      };
    }

    let sumTeaching = 0;
    let sumMarking = 0;
    let sumComm = 0;
    let sumApproach = 0;
    let sumDiff = 0;
    let wouldTakeCount = 0;

    reviews.forEach(r => {
      sumTeaching += Number(r.teachingRating || 0);
      sumMarking += Number(r.markingRating || 0);
      sumComm += Number(r.communicationRating || 0);
      sumApproach += Number(r.approachabilityRating || 0);
      sumDiff += Number(r.difficultyRating || 0);
      if (r.wouldTakeAgain) wouldTakeCount++;
    });

    const count = reviews.length;
    const avgTeaching = sumTeaching / count;
    const avgMarking = sumMarking / count;
    const avgComm = sumComm / count;
    const avgApproach = sumApproach / count;
    const avgDifficulty = sumDiff / count;

    // Overall Rating = average of 4 core pillars
    const overall = (avgTeaching + avgMarking + avgComm + avgApproach) / 4;

    return {
      overallRating: Number(overall.toFixed(1)),
      teachingRating: Number(avgTeaching.toFixed(1)),
      markingRating: Number(avgMarking.toFixed(1)),
      communicationRating: Number(avgComm.toFixed(1)),
      approachabilityRating: Number(avgApproach.toFixed(1)),
      difficultyRating: Number(avgDifficulty.toFixed(1)),
      wouldTakeAgainPercent: Math.round((wouldTakeCount / count) * 100),
      reviewCount: count
    };
  },

  // --- REVIEWS & SUBMISSIONS ---
  async submitReview(reviewData) {
    const user = this.getCurrentUser();
    const reviews = getStoredData(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);

    // Duplicate Check: one review per user per professor + course + semester + academic_year
    const duplicate = reviews.find(r => 
      r.userId === user.id &&
      r.profId === reviewData.profId &&
      r.courseId === reviewData.courseId &&
      r.semester === reviewData.semester &&
      Number(r.academicYear) === Number(reviewData.academicYear)
    );

    if (duplicate) {
      throw new Error('You have already submitted a review for this professor, course, and semester. Duplicate reviews are not allowed.');
    }

    // Credibility & Fraud Calculation
    let credibilityScore = 85.0;
    let riskScore = 0.0;
    if (user.verificationLevel === 'email_verified') credibilityScore += 10;
    if (reviewData.reviewText.length < 30) riskScore += 20;

    const newReview = {
      id: `rev-${Date.now()}`,
      userId: user.id,
      profId: reviewData.profId,
      courseId: reviewData.courseId,
      courseName: reviewData.courseName || 'General Course',
      teachingRating: Number(reviewData.teachingRating),
      markingRating: Number(reviewData.markingRating),
      communicationRating: Number(reviewData.communicationRating),
      approachabilityRating: Number(reviewData.approachabilityRating),
      difficultyRating: Number(reviewData.difficultyRating),
      wouldTakeAgain: Boolean(reviewData.wouldTakeAgain),
      reviewText: sanitizeText(reviewData.reviewText),
      semester: reviewData.semester,
      academicYear: Number(reviewData.academicYear),
      status: riskScore > 30 ? 'pending' : 'approved',
      credibilityLabel: user.verificationLevel === 'email_verified' ? 'Verified Student' : 'Community Review',
      credibilityScore,
      riskScore,
      createdAt: new Date().toISOString()
    };

    reviews.unshift(newReview);
    setStoredData(STORAGE_KEYS.REVIEWS, reviews);
    return newReview;
  },

  async reportReview(reportData) {
    const user = this.getCurrentUser();
    const reports = getStoredData(STORAGE_KEYS.REPORTS, []);

    const newReport = {
      id: `rep-${Date.now()}`,
      reviewId: reportData.reviewId,
      userId: user.id,
      reason: reportData.reason,
      details: sanitizeText(reportData.details || ''),
      status: 'open',
      createdAt: new Date().toISOString()
    };

    reports.unshift(newReport);
    setStoredData(STORAGE_KEYS.REPORTS, reports);

    // Flag the reported review if risk is high
    const reviews = getStoredData(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    const targetIdx = reviews.findIndex(r => r.id === reportData.reviewId);
    if (targetIdx !== -1) {
      reviews[targetIdx].status = 'flagged';
      reviews[targetIdx].riskScore = Math.min(100, (reviews[targetIdx].riskScore || 0) + 35);
      setStoredData(STORAGE_KEYS.REVIEWS, reviews);
    }

    return newReport;
  },

  // --- REVIEWS & SUBMISSIONS ---
  async requestMissingCollege(requestData) {
    const user = this.getCurrentUser();
    const requests = getStoredData(STORAGE_KEYS.COLLEGE_REQUESTS, []);

    const newRequest = {
      id: `col-req-${Date.now()}`,
      submittedBy: user.id,
      name: sanitizeText(requestData.name),
      city: sanitizeText(requestData.city),
      state: sanitizeText(requestData.state),
      website: requestData.website || '',
      description: sanitizeText(requestData.description || ''),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    requests.unshift(newRequest);
    setStoredData(STORAGE_KEYS.COLLEGE_REQUESTS, requests);
    return newRequest;
  },

  async requestMissingProfessor(requestData) {
    const user = this.getCurrentUser();
    const requests = getStoredData(STORAGE_KEYS.REQUESTS, []);

    const newRequest = {
      id: `req-${Date.now()}`,
      submittedBy: user.id,
      name: sanitizeText(requestData.name),
      collegeId: requestData.collegeId,
      collegeName: requestData.collegeName,
      departmentId: requestData.departmentId,
      departmentName: requestData.departmentName,
      sourceUrl: requestData.sourceUrl || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    requests.unshift(newRequest);
    setStoredData(STORAGE_KEYS.REQUESTS, requests);
    return newRequest;
  },

  // --- ADMIN MODERATION & MANAGEMENT ---
  async getAdminStats() {
    const reviews = getStoredData(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    const reports = getStoredData(STORAGE_KEYS.REPORTS, []);
    const profRequests = getStoredData(STORAGE_KEYS.REQUESTS, []);
    const collegeRequests = getStoredData(STORAGE_KEYS.COLLEGE_REQUESTS, []);
    const professors = getStoredData(STORAGE_KEYS.PROFESSORS, SEED_PROFESSORS);
    const colleges = getStoredData(STORAGE_KEYS.COLLEGES, SEED_COLLEGES);

    const pendingReviews = reviews.filter(r => r.status === 'pending');
    const flaggedReviews = reviews.filter(r => r.status === 'flagged');

    return {
      totalColleges: colleges.length,
      totalProfessors: professors.length,
      totalReviews: reviews.length,
      pendingModerationCount: pendingReviews.length,
      flaggedReviewsCount: flaggedReviews.length,
      openReportsCount: reports.filter(rep => rep.status === 'open').length,
      pendingProfessorRequestsCount: profRequests.filter(req => req.status === 'pending').length,
      pendingCollegeRequestsCount: collegeRequests.filter(req => req.status === 'pending').length
    };
  },

  async getCollegeRequests() {
    return getStoredData(STORAGE_KEYS.COLLEGE_REQUESTS, []);
  },

  async getProfessorRequests() {
    return getStoredData(STORAGE_KEYS.REQUESTS, []);
  },

  async approveCollegeRequest(requestId) {
    const requests = getStoredData(STORAGE_KEYS.COLLEGE_REQUESTS, []);
    const targetIdx = requests.findIndex(r => r.id === requestId);
    if (targetIdx !== -1) {
      requests[targetIdx].status = 'approved';
      setStoredData(STORAGE_KEYS.COLLEGE_REQUESTS, requests);

      // Add to official Colleges list
      const colleges = getStoredData(STORAGE_KEYS.COLLEGES, SEED_COLLEGES);
      const req = requests[targetIdx];
      const newCollege = {
        id: `col-${Date.now()}`,
        name: req.name,
        city: req.city,
        state: req.state,
        website: req.website || '',
        badge: 'Verified Institution',
        departmentsCount: 5,
        professorsCount: 1
      };
      colleges.unshift(newCollege);
      const cleanedColleges = deduplicateColleges(colleges);
      setStoredData(STORAGE_KEYS.COLLEGES, cleanedColleges);

      // Add a default department for this college
      const departments = getStoredData('ratemyproff_departments_v1', SEED_DEPARTMENTS);
      departments.unshift({ id: `dept-${Date.now()}`, collegeId: newCollege.id, name: 'General Academics' });
      setStoredData('ratemyproff_departments_v1', departments);

      return newCollege;
    }
    return null;
  },

  async approveProfessorRequest(requestId, verificationStatus = 'Faculty Verified') {
    const requests = getStoredData(STORAGE_KEYS.REQUESTS, []);
    const targetIdx = requests.findIndex(r => r.id === requestId);
    if (targetIdx !== -1) {
      requests[targetIdx].status = 'approved';
      setStoredData(STORAGE_KEYS.REQUESTS, requests);

      // Add to official Professors list
      const req = requests[targetIdx];
      const professors = getStoredData(STORAGE_KEYS.PROFESSORS, SEED_PROFESSORS);
      const newProf = {
        id: `prof-${Date.now()}`,
        collegeId: req.collegeId,
        collegeName: req.collegeName,
        departmentId: req.departmentId,
        departmentName: req.departmentName,
        name: req.name,
        designation: 'Faculty Member',
        profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        verificationStatus: verificationStatus,
        bio: 'Faculty member verified by admin.'
      };
      professors.unshift(newProf);
      const cleanedProfessors = deduplicateProfessors(professors);
      setStoredData(STORAGE_KEYS.PROFESSORS, cleanedProfessors);
      return newProf;
    }
    return null;
  },

  async rejectRequest(type, requestId) {
    const key = type === 'college' ? STORAGE_KEYS.COLLEGE_REQUESTS : STORAGE_KEYS.REQUESTS;
    const requests = getStoredData(key, []);
    const targetIdx = requests.findIndex(r => r.id === requestId);
    if (targetIdx !== -1) {
      requests[targetIdx].status = 'rejected';
      setStoredData(key, requests);
      return requests[targetIdx];
    }
    return null;
  },

  async getModerationQueue() {
    const reviews = getStoredData(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    return reviews.filter(r => r.status === 'pending' || r.status === 'flagged');
  },

  async updateReviewStatus(reviewId, newStatus) {
    const reviews = getStoredData(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    const targetIdx = reviews.findIndex(r => r.id === reviewId);
    if (targetIdx !== -1) {
      reviews[targetIdx].status = newStatus;
      setStoredData(STORAGE_KEYS.REVIEWS, reviews);
      return reviews[targetIdx];
    }
    return null;
  },

  async addProfessor(profData) {
    const professors = getStoredData(STORAGE_KEYS.PROFESSORS, SEED_PROFESSORS);
    const newProf = {
      id: `prof-${Date.now()}`,
      collegeId: profData.collegeId,
      collegeName: profData.collegeName,
      departmentId: profData.departmentId,
      departmentName: profData.departmentName,
      name: profData.name,
      designation: profData.designation,
      profileUrl: profData.profileUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      verificationStatus: profData.verificationStatus || 'Community Submitted',
      bio: profData.bio || 'Faculty member.'
    };
    professors.unshift(newProf);
    const cleanedProfessors = deduplicateProfessors(professors);
    setStoredData(STORAGE_KEYS.PROFESSORS, cleanedProfessors);
    return newProf;
  },

  // --- FULL ADMIN AUTHORITY CRUD OPERATIONS ---
  async deleteProfessor(profId) {
    let professors = getStoredData(STORAGE_KEYS.PROFESSORS, SEED_PROFESSORS);
    const initialLen = professors.length;
    professors = professors.filter(p => p.id !== profId);
    setStoredData(STORAGE_KEYS.PROFESSORS, professors);
    this.logAdminAction('PROFESSOR_DELETED', `Deleted professor record #${profId}`);
    return professors.length < initialLen;
  },

  async updateProfessor(profId, updatedFields) {
    const professors = getStoredData(STORAGE_KEYS.PROFESSORS, SEED_PROFESSORS);
    const idx = professors.findIndex(p => p.id === profId);
    if (idx !== -1) {
      professors[idx] = {
        ...professors[idx],
        ...updatedFields,
        name: updatedFields.name ? sanitizeText(updatedFields.name) : professors[idx].name,
        designation: updatedFields.designation ? sanitizeText(updatedFields.designation) : professors[idx].designation,
        bio: updatedFields.bio ? sanitizeText(updatedFields.bio) : professors[idx].bio
      };
      setStoredData(STORAGE_KEYS.PROFESSORS, professors);
      this.logAdminAction('PROFESSOR_UPDATED', `Updated professor details for #${profId} (${professors[idx].name})`);
      return professors[idx];
    }
    return null;
  },

  async deleteCollege(collegeId) {
    let colleges = getStoredData(STORAGE_KEYS.COLLEGES, SEED_COLLEGES);
    const initialLen = colleges.length;
    colleges = colleges.filter(c => c.id !== collegeId);
    setStoredData(STORAGE_KEYS.COLLEGES, colleges);
    this.logAdminAction('COLLEGE_DELETED', `Deleted institution record #${collegeId}`);
    return colleges.length < initialLen;
  },

  async updateCollege(collegeId, updatedFields) {
    const colleges = getStoredData(STORAGE_KEYS.COLLEGES, SEED_COLLEGES);
    const idx = colleges.findIndex(c => c.id === collegeId);
    if (idx !== -1) {
      colleges[idx] = {
        ...colleges[idx],
        ...updatedFields,
        name: updatedFields.name ? sanitizeText(updatedFields.name) : colleges[idx].name,
        city: updatedFields.city ? sanitizeText(updatedFields.city) : colleges[idx].city,
        state: updatedFields.state ? sanitizeText(updatedFields.state) : colleges[idx].state
      };
      setStoredData(STORAGE_KEYS.COLLEGES, colleges);
      this.logAdminAction('COLLEGE_UPDATED', `Updated institution details for #${collegeId} (${colleges[idx].name})`);
      return colleges[idx];
    }
    return null;
  },

  async deleteReview(reviewId) {
    let reviews = getStoredData(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    const initialLen = reviews.length;
    reviews = reviews.filter(r => r.id !== reviewId);
    setStoredData(STORAGE_KEYS.REVIEWS, reviews);
    this.logAdminAction('REVIEW_DELETED', `Deleted review entry #${reviewId}`);
    return reviews.length < initialLen;
  },

  async getAllReviews() {
    return getStoredData(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  },

  async deleteAccount(userId) {
    let accounts = this.getAccounts();
    const initialLen = accounts.length;
    accounts = accounts.filter(a => a.id !== userId);
    this.saveAccounts(accounts);
    this.logAdminAction('ACCOUNT_DELETED', `Admin removed user account #${userId}`);
    return accounts.length < initialLen;
  },

  async toggleAccountRole(userId) {
    const accounts = this.getAccounts();
    const idx = accounts.findIndex(a => a.id === userId);
    if (idx !== -1) {
      const newRole = accounts[idx].role === 'admin' ? 'student' : 'admin';
      accounts[idx].role = newRole;
      accounts[idx].isAdmin = newRole === 'admin';
      this.saveAccounts(accounts);
      this.logAdminAction('ACCOUNT_ROLE_CHANGED', `Changed user role for #${userId} to ${newRole}`);
      return accounts[idx];
    }
    return null;
  }
};
