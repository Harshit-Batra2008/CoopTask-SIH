/**
 * @typedef {string} JobStatus
 */
export const JOB_STATUS = {
  REQUESTED: 'REQUESTED',
  MATCHING: 'MATCHING',
  ASSIGNED: 'ASSIGNED',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
};

/**
 * @typedef {string} Urgency
 */
export const URGENCY = {
  NORMAL: 'NORMAL',
  URGENT: 'URGENT',
  EMERGENCY: 'EMERGENCY',
};

export const SERVICE_TYPES = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Cleaner',
  'Painter',
  'Appliance Repair'
];

export const AREAS = [
  'Dwarka',
  'Rohini',
  'Janakpuri',
  'Uttam Nagar',
  'Vikaspuri',
  'Rajouri Garden',
  'Paschim Vihar',
  'Pitampura'
];

export const FAIRMATCH_WEIGHTS = {
  skill: 0.30,
  distance: 0.40,
  workload: 0.30
};
