/** Sidebar definitions per role. `to` is relative to /<role>/ */
const staffNav = (role) => [
  { items: [{ to: '', label: 'Dashboard', icon: 'home', end: true }] },
  {
    title: 'People',
    items: [
      { to: 'students', label: 'Students', icon: 'users' },
      { to: 'teachers', label: 'Teachers', icon: 'user' },
      { to: 'assistants', label: 'Assistants', icon: 'userPlus' },
      ...(role === 'admin' ? [{ to: 'admins', label: 'Admins', icon: 'shield' }] : []),
    ],
  },
  {
    title: 'Academics',
    items: [
      { to: 'courses', label: 'Courses', icon: 'book' },
      { to: 'batches', label: 'Batches', icon: 'layers' },
      { to: 'enrollments', label: 'Enrollments', icon: 'clipboard' },
      { to: 'certificates', label: 'Certificates', icon: 'award' },
      { to: 'pincodes', label: 'Pincodes', icon: 'pin' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { to: 'fees', label: 'Fees', icon: 'card' },
      { to: 'salaries', label: 'Salaries', icon: 'dollar' },
      { to: 'attendance/students', label: 'Student attendance', icon: 'check' },
      { to: 'attendance/teachers', label: 'Teacher attendance', icon: 'check' },
      { to: 'attendance/assistants', label: 'Assistant attendance', icon: 'check' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { to: 'notifications', label: 'Global notifications', icon: 'bell', badge: 'unread' },
      { to: 'complaints', label: 'Complaints', icon: 'alert' },
    ],
  },
  {
    title: 'Me',
    items: [
      ...(role === 'assistant' ? [{ to: 'my-records', label: 'My salary & attendance', icon: 'calendar' }] : []),
      { to: 'explorer', label: 'All data', icon: 'database' },
      { to: 'profile', label: 'Profile', icon: 'user' },
    ],
  },
];

export const NAV = {
  student: [
    {
      items: [
        { to: '', label: 'Dashboard', icon: 'home', end: true },
        { to: 'batches', label: 'My batches', icon: 'layers' },
        { to: 'notifications', label: 'Notifications', icon: 'bell', badge: 'unread' },
        { to: 'complaints', label: 'Complaints', icon: 'alert' },
        { to: 'profile', label: 'Profile', icon: 'user' },
      ],
    },
  ],
  teacher: [
    {
      items: [
        { to: '', label: 'Dashboard', icon: 'home', end: true },
        { to: 'batches', label: 'My batches', icon: 'layers' },
        { to: 'notifications', label: 'Notifications', icon: 'bell', badge: 'unread' },
        { to: 'salary', label: 'Salary status', icon: 'dollar' },
        { to: 'complaints', label: 'Complaints', icon: 'alert' },
        { to: 'profile', label: 'Profile', icon: 'user' },
      ],
    },
  ],
  assistant: staffNav('assistant'),
  admin: staffNav('admin'),
};
