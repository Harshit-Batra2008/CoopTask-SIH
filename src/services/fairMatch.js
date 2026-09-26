import { FAIRMATCH_WEIGHTS } from '../types/index.js';

/**
 * Calculates skill score based on worker's skills, experience, and rating.
 * @param {Object} worker
 * @param {string} requestedSkill
 * @returns {number} 0-100 normalized score
 */
export function calculateSkillScore(worker, requestedSkill) {
  if (!worker.skills.includes(requestedSkill) && worker.skill !== requestedSkill) {
    return 0;
  }

  let score = 50;
  const ratingBonus = Math.max(0, (worker.rating - 3.0) / 2.0) * 30;
  score += ratingBonus;

  const expBonus = Math.min(20, (worker.completedJobs / 100.0) * 20);
  score += expBonus;

  return Math.min(100, score);
}

/**
 * Calculates distance score. Closer is better.
 * @param {number} distance in km
 * @returns {number} 0-100 normalized score
 */
export function calculateDistanceScore(distance) {
  const maxUsefulDistance = 25; // 25km
  if (distance >= maxUsefulDistance) return 0;
  
  const score = ((maxUsefulDistance - distance) / maxUsefulDistance) * 100;
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates workload score. Lower workload is better.
 * @param {number} workload active jobs
 * @returns {number} 0-100 normalized score
 */
export function calculateWorkloadScore(workload) {
  const maxCapacity = 5;
  if (workload >= maxCapacity) return 0;
  
  const score = ((maxCapacity - workload) / maxCapacity) * 100;
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculates the fair match score for a worker and request.
 * @param {Object} worker
 * @param {Object} request
 * @returns {Object} Match details
 */
export function calculateFairMatch(worker, request) {
  const { serviceType } = request;
  
  const eligible = worker.verified && worker.available && worker.skill === serviceType;
  if (!eligible) {
    return { total: 0, eligible: false };
  }

  const rawSkillScore = calculateSkillScore(worker, request.subSkill || serviceType);
  if (rawSkillScore === 0 && request.subSkill) {
    return { total: 0, eligible: false };
  }

  const rawDistanceScore = calculateDistanceScore(worker.distance);
  const rawWorkloadScore = calculateWorkloadScore(worker.workload);

  const skillScore = rawSkillScore * FAIRMATCH_WEIGHTS.skill;     // Max 30
  const distanceScore = rawDistanceScore * FAIRMATCH_WEIGHTS.distance; // Max 40
  const workloadScore = rawWorkloadScore * FAIRMATCH_WEIGHTS.workload; // Max 30

  const total = skillScore + distanceScore + workloadScore;

  return {
    total: Math.round(total),
    eligible: true,
    breakdown: {
      skill: {
        score: Math.round(skillScore),
        max: FAIRMATCH_WEIGHTS.skill * 100,
        label: 'Skill & Rating'
      },
      distance: {
        score: Math.round(distanceScore),
        max: FAIRMATCH_WEIGHTS.distance * 100,
        label: 'Proximity',
        detail: `${worker.distance}km away`
      },
      workload: {
        score: Math.round(workloadScore),
        max: FAIRMATCH_WEIGHTS.workload * 100,
        label: 'Availability',
        detail: `${worker.workload} active jobs`
      }
    }
  };
}

/**
 * Ranks workers based on the fair match algorithm.
 * @param {Array} workers
 * @param {Object} request
 * @returns {Array} Array of { worker, match } objects sorted by score desc
 */
export function rankWorkers(workers, request) {
  const ranked = workers
    .map(worker => {
      const match = calculateFairMatch(worker, request);
      return { worker, match };
    })
    .filter(item => item.match.eligible)
    .sort((a, b) => b.match.total - a.match.total);
    
  return ranked;
}
