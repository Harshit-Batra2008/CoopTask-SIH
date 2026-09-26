import { JOB_STATUS, URGENCY } from '../types/index.js';

const customer = {
  id: 'c1',
  name: 'CodeCooperatives',
  phone: 'Cooperative workforce team',
  area: 'Demo environment'
};

const workers = [
  { id: 'w1', name: 'Ravi Kumar', skill: 'Electrician', area: 'Dwarka', distance: 1.8, rating: 4.8, completedJobs: 127, workload: 1, verified: true, available: true, phone: '9876500001', skills: ['Electrical Repair', 'Wiring', 'Appliance Installation', 'Switch/Socket Repair'], joinedDate: '2023-01-15' },
  { id: 'w2', name: 'Amit Verma', skill: 'Electrician', area: 'Dwarka', distance: 3.4, rating: 4.6, completedJobs: 89, workload: 2, verified: true, available: true, phone: '9876500002', skills: ['Electrical Repair', 'Wiring'], joinedDate: '2023-03-10' },
  { id: 'w3', name: 'Sanjay Yadav', skill: 'Plumber', area: 'Dwarka', distance: 2.1, rating: 4.7, completedJobs: 156, workload: 0, verified: true, available: true, phone: '9876500003', skills: ['Pipe Repair', 'Leak Fixing', 'Bathroom Fitting', 'Water Tank'], joinedDate: '2022-11-05' },
  { id: 'w4', name: 'Priya Sharma', skill: 'Cleaner', area: 'Rohini', distance: 5.2, rating: 4.9, completedJobs: 203, workload: 1, verified: true, available: true, phone: '9876500004', skills: ['Deep Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning', 'Move-out Cleaning'], joinedDate: '2022-08-20' },
  { id: 'w5', name: 'Deepak Tiwari', skill: 'Carpenter', area: 'Janakpuri', distance: 4.1, rating: 4.5, completedJobs: 78, workload: 3, verified: true, available: true, phone: '9876500005', skills: ['Furniture Repair', 'Door/Window Fitting', 'Cabinet Work', 'Wood Polish'], joinedDate: '2023-05-12' },
  { id: 'w6', name: 'Manoj Singh', skill: 'Electrician', area: 'Uttam Nagar', distance: 6.3, rating: 4.3, completedJobs: 45, workload: 0, verified: true, available: true, phone: '9876500006', skills: ['Electrical Repair', 'Switch/Socket Repair'], joinedDate: '2023-09-01' },
  { id: 'w7', name: 'Sunita Devi', skill: 'Cleaner', area: 'Dwarka', distance: 1.2, rating: 4.8, completedJobs: 167, workload: 2, verified: true, available: true, phone: '9876500007', skills: ['Deep Cleaning', 'Kitchen Cleaning'], joinedDate: '2022-10-15' },
  { id: 'w8', name: 'Rajesh Gupta', skill: 'Plumber', area: 'Vikaspuri', distance: 3.8, rating: 4.4, completedJobs: 92, workload: 1, verified: true, available: true, phone: '9876500008', skills: ['Pipe Repair', 'Leak Fixing'], joinedDate: '2023-04-22' },
  { id: 'w9', name: 'Vikram Chauhan', skill: 'Painter', area: 'Paschim Vihar', distance: 5.5, rating: 4.6, completedJobs: 64, workload: 0, verified: true, available: true, phone: '9876500009', skills: ['Wall Painting', 'Texture Painting', 'Waterproofing', 'Wood Painting'], joinedDate: '2023-06-30' },
  { id: 'w10', name: 'Neha Rawat', skill: 'Electrician', area: 'Rohini', distance: 7.1, rating: 4.2, completedJobs: 34, workload: 1, verified: false, available: false, phone: '9876500010', skills: ['Electrical Repair'], joinedDate: '2023-11-10' },
  { id: 'w11', name: 'Karan Malhotra', skill: 'Carpenter', area: 'Rajouri Garden', distance: 4.7, rating: 4.7, completedJobs: 112, workload: 2, verified: true, available: true, phone: '9876500011', skills: ['Furniture Repair', 'Wood Polish'], joinedDate: '2023-02-28' },
  { id: 'w12', name: 'Pooja Nair', skill: 'Appliance Repair', area: 'Pitampura', distance: 8.2, rating: 4.5, completedJobs: 56, workload: 0, verified: true, available: true, phone: '9876500012', skills: ['AC Repair', 'Washing Machine', 'Refrigerator', 'Microwave'], joinedDate: '2023-07-15' }
];

const requests = [
  { id: 'req1', customerId: 'c1', assignedWorkerId: 'w1', serviceType: 'Electrician', subSkill: 'Wiring', status: JOB_STATUS.COMPLETED, urgency: URGENCY.NORMAL, timestamps: { created: 1787220000000, updated: 1787220000000 }, area: 'Dwarka', matchScore: 92, amount: 500 },
  { id: 'req2', customerId: 'c1', assignedWorkerId: 'w3', serviceType: 'Plumber', subSkill: 'Leak Fixing', status: JOB_STATUS.COMPLETED, urgency: URGENCY.URGENT, timestamps: { created: 1787668200000, updated: 1787668200000 }, area: 'Dwarka', matchScore: 88, amount: 800 },
  { id: 'req3', customerId: 'c1', assignedWorkerId: 'w7', serviceType: 'Cleaner', subSkill: 'Deep Cleaning', status: JOB_STATUS.CANCELLED, urgency: URGENCY.NORMAL, timestamps: { created: 1788254100000, updated: 1788254100000 }, area: 'Dwarka', matchScore: 95, amount: 1500 },
  { id: 'req4', customerId: 'c1', assignedWorkerId: 'w2', serviceType: 'Electrician', subSkill: 'Appliance Installation', status: JOB_STATUS.COMPLETED, urgency: URGENCY.NORMAL, timestamps: { created: 1788608700000, updated: 1788608700000 }, area: 'Dwarka', matchScore: 85, amount: 600 },
  { id: 'req5', customerId: 'c1', assignedWorkerId: 'w5', serviceType: 'Carpenter', subSkill: 'Furniture Repair', status: JOB_STATUS.IN_PROGRESS, urgency: URGENCY.NORMAL, timestamps: { created: 1790353200000, updated: 1790353200000 }, area: 'Dwarka', matchScore: 78, amount: 1200 },
  { id: 'req6', customerId: 'c1', assignedWorkerId: null, serviceType: 'Painter', subSkill: 'Wall Painting', status: JOB_STATUS.REQUESTED, urgency: URGENCY.NORMAL, timestamps: { created: 1790409600000, updated: 1790409600000 }, area: 'Dwarka', matchScore: null, amount: 5000 },
  { id: 'req7', customerId: 'c1', assignedWorkerId: 'w8', serviceType: 'Plumber', subSkill: 'Pipe Repair', status: JOB_STATUS.COMPLETED, urgency: URGENCY.EMERGENCY, timestamps: { created: 1789078200000, updated: 1789078200000 }, area: 'Dwarka', matchScore: 82, amount: 1000 },
  { id: 'req8', customerId: 'c1', assignedWorkerId: 'w1', serviceType: 'Electrician', subSkill: 'Electrical Repair', status: JOB_STATUS.COMPLETED, urgency: URGENCY.NORMAL, timestamps: { created: 1789218000000, updated: 1789218000000 }, area: 'Dwarka', matchScore: 94, amount: 400 },
  { id: 'req9', customerId: 'c1', assignedWorkerId: 'w11', serviceType: 'Carpenter', subSkill: 'Door/Window Fitting', status: JOB_STATUS.REJECTED, urgency: URGENCY.NORMAL, timestamps: { created: 1789487100000, updated: 1789487100000 }, area: 'Dwarka', matchScore: 80, amount: 900 },
  { id: 'req10', customerId: 'c1', assignedWorkerId: 'w4', serviceType: 'Cleaner', subSkill: 'Kitchen Cleaning', status: JOB_STATUS.COMPLETED, urgency: URGENCY.NORMAL, timestamps: { created: 1789727400000, updated: 1789727400000 }, area: 'Dwarka', matchScore: 75, amount: 800 },
  { id: 'req11', customerId: 'c1', assignedWorkerId: 'w12', serviceType: 'Appliance Repair', subSkill: 'AC Repair', status: JOB_STATUS.ASSIGNED, urgency: URGENCY.URGENT, timestamps: { created: 1790413200000, updated: 1790413200000 }, area: 'Dwarka', matchScore: 72, amount: 1500 },
  { id: 'req12', customerId: 'c1', assignedWorkerId: 'w9', serviceType: 'Painter', subSkill: 'Texture Painting', status: JOB_STATUS.COMPLETED, urgency: URGENCY.NORMAL, timestamps: { created: 1789902000000, updated: 1789902000000 }, area: 'Dwarka', matchScore: 70, amount: 3500 },
  { id: 'req13', customerId: 'c1', assignedWorkerId: 'w6', serviceType: 'Electrician', subSkill: 'Switch/Socket Repair', status: JOB_STATUS.ACCEPTED, urgency: URGENCY.NORMAL, timestamps: { created: 1790415000000, updated: 1790415000000 }, area: 'Dwarka', matchScore: 77, amount: 300 },
  { id: 'req14', customerId: 'c1', assignedWorkerId: 'w3', serviceType: 'Plumber', subSkill: 'Bathroom Fitting', status: JOB_STATUS.COMPLETED, urgency: URGENCY.NORMAL, timestamps: { created: 1790085600000, updated: 1790085600000 }, area: 'Dwarka', matchScore: 90, amount: 2000 },
  { id: 'req15', customerId: 'c1', assignedWorkerId: 'w7', serviceType: 'Cleaner', subSkill: 'Bathroom Cleaning', status: JOB_STATUS.MATCHING, urgency: URGENCY.URGENT, timestamps: { created: 1790416800000, updated: 1790416800000 }, area: 'Dwarka', matchScore: null, amount: 600 }
];

const notifications = [
  { id: 'n1', role: 'customer', type: 'INFO', message: 'Welcome to CoopTask!', read: true, timestamp: 1786784400000 },
  { id: 'n2', role: 'customer', type: 'SUCCESS', message: 'Your payment for job req1 was successful.', read: true, timestamp: 1787227200000 },
  { id: 'n3', role: 'worker', targetWorkerId: 'w1', type: 'INFO', message: 'You have a new job request in Dwarka.', read: true, timestamp: 1787219700000 },
  { id: 'n4', role: 'customer', type: 'WARNING', message: 'Your request req3 has been cancelled.', read: true, timestamp: 1788256800000 },
  { id: 'n5', role: 'customer', type: 'SUCCESS', message: 'Ravi Kumar has completed your electrical repair.', read: true, timestamp: 1789225200000 },
  { id: 'n6', role: 'worker', targetWorkerId: 'w1', type: 'INFO', message: 'Reminder: You have an upcoming job at 16:30.', read: false, timestamp: 1790348400000 },
  { id: 'n7', role: 'customer', type: 'INFO', message: 'Manoj Singh accepted your request.', read: false, timestamp: 1790415300000 },
  { id: 'n8', role: 'worker', targetWorkerId: 'w1', type: 'SUCCESS', message: 'You accepted request req13.', read: true, timestamp: 1790415300000 },
  { id: 'n9', role: 'customer', type: 'INFO', message: 'Matching workers for your cleaner request.', read: false, timestamp: 1790417100000 },
  { id: 'n10', role: 'worker', targetWorkerId: 'w1', type: 'INFO', message: 'You have been assigned to AC Repair in Dwarka.', read: false, timestamp: 1790413500000 }
];

const reviews = [
  { id: 'r1', requestId: 'req1', workerId: 'w1', customerId: 'c1', rating: 5, comment: 'Excellent work, very professional.', timestamp: 1787229000000 },
  { id: 'r2', requestId: 'req2', workerId: 'w3', customerId: 'c1', rating: 4, comment: 'Fixed the leak quickly, but arrived a bit late.', timestamp: 1787673600000 },
  { id: 'r3', requestId: 'req4', workerId: 'w2', customerId: 'c1', rating: 5, comment: 'Great job with the installation.', timestamp: 1788613200000 },
  { id: 'r4', requestId: 'req7', workerId: 'w8', customerId: 'c1', rating: 4, comment: 'Came at night for the emergency, good work.', timestamp: 1789083000000 },
  { id: 'r5', requestId: 'req8', workerId: 'w1', customerId: 'c1', rating: 5, comment: 'Ravi is always reliable.', timestamp: 1789227000000 },
  { id: 'r6', requestId: 'req10', workerId: 'w4', customerId: 'c1', rating: 5, comment: 'Very thorough cleaning.', timestamp: 1789736400000 },
  { id: 'r7', requestId: 'req12', workerId: 'w9', customerId: 'c1', rating: 4, comment: 'Nice painting, slightly messy floor though.', timestamp: 1789916400000 },
  { id: 'r8', requestId: 'req14', workerId: 'w3', customerId: 'c1', rating: 5, comment: 'Bathroom looks great.', timestamp: 1790096400000 }
];

export function getInitialState() {
  return {
    customer,
    workers,
    requests,
    notifications,
    reviews
  };
}
