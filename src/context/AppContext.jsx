import React, { createContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { getInitialState } from '../data/seedData';
import { rankWorkers } from '../services/fairMatch';
import { saveState, loadState, clearState } from '../services/persistence';
import { generateOTP, verifyOTP } from '../services/otpService';

export const AppContext = createContext(null);

const initialState = {
  currentRole: 'customer',
  activeWorkerId: 'w1',
  customer: null,
  workers: [],
  requests: [],
  notifications: [],
  reviews: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'INIT_STATE':
      return { ...state, ...action.payload };
    case 'SET_ROLE':
      return { ...state, currentRole: action.payload };
    case 'SET_ACTIVE_WORKER':
      return { ...state, activeWorkerId: action.payload };
    case 'ADD_REQUEST':
      return { ...state, requests: [action.payload, ...state.requests] };
    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map((req) =>
          req.id === action.payload.id
            ? { ...req, ...action.payload.updates }
            : req
        ),
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'UPDATE_WORKER':
      return {
        ...state,
        workers: state.workers.map((w) =>
          w.id === action.payload.id ? { ...w, ...action.payload.updates } : w
        ),
      };
    case 'ADD_REVIEW':
      return { ...state, reviews: [action.payload, ...state.reviews] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.role !== action.payload),
      };
    case 'RESET_DEMO':
      return { ...initialState, ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state on mount
  useEffect(() => {
    const loaded = loadState();
    if (loaded && loaded.workers && loaded.workers.length > 0) {
      dispatch({ type: 'INIT_STATE', payload: loaded });
    } else {
      const seed = getInitialState();
      dispatch({ type: 'INIT_STATE', payload: seed });
    }
  }, []);

  // Auto-save to localStorage with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.customer || state.workers.length > 0) {
        saveState(state);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  // --- Action Helpers ---
  const addNotification = useCallback((type, title, message, role, extra = {}) => {
    const notification = {
      id: 'n-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type,
      title,
      message,
      role,
      read: false,
      timestamp: Date.now(),
      ...extra,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, []);

  // --- Request Management ---
  const createRequest = useCallback(
    ({ service, area, address, description, urgency, preferredTime, photo }) => {
      // Generate new ID based on existing requests
      const existingNums = state.requests
        .map((r) => {
          const match = r.id.match(/CT-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((n) => !isNaN(n));
      const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1001;
      const newId = `CT-${nextNum}`;

      const newReq = {
        id: newId,
        serviceType: service,
        area,
        address: address || '',
        description: description || '',
        urgency: urgency || 'NORMAL',
        preferredTime: preferredTime || '',
        photo: photo || null,
        status: 'MATCHING',
        timestamps: { created: Date.now() },
        customerId: state.customer?.id || 'c1',
        assignedWorkerId: null,
        matches: [],
        otp: null,
        matchScore: null,
      };

      // Run FairMatch
      const matches = rankWorkers(state.workers, newReq);
      newReq.matches = matches.map((m) => ({
        workerId: m.worker.id,
        score: m.match.total,
        breakdown: m.match.breakdown,
      }));

      dispatch({ type: 'ADD_REQUEST', payload: newReq });

      addNotification(
        'request_created',
        'Request submitted',
        `Your ${service.toLowerCase()} request has been submitted. Finding workers...`,
        'customer',
        { requestId: newId }
      );

      // Notify top matched workers
      if (matches.length > 0) {
        matches.slice(0, 3).forEach((m) => {
          addNotification(
            'new_job',
            `New ${service.toLowerCase()} request near ${area}`,
            `A new ${service.toLowerCase()} job is available in ${area}.`,
            'worker',
            { requestId: newId, targetWorkerId: m.worker.id }
          );
        });
      }

      // Notify admin
      addNotification(
        'new_request',
        'New service request',
        `A new ${service.toLowerCase()} request in ${area} requires matching.`,
        'admin',
        { requestId: newId }
      );

      // Simulate matching delay, then auto-assign top match
      if (matches.length > 0) {
        setTimeout(() => {
          const otp = generateOTP(newId);
          const topMatch = matches[0];
          dispatch({
            type: 'UPDATE_REQUEST',
            payload: {
              id: newId,
              updates: {
                status: 'ASSIGNED',
                assignedWorkerId: topMatch.worker.id,
                otp,
                matchScore: topMatch.match.total,
              },
            },
          });

          addNotification(
            'worker_assigned',
            `${topMatch.worker.name} assigned`,
            `${topMatch.worker.name} has been matched to your ${service.toLowerCase()} request.`,
            'customer',
            { requestId: newId }
          );

          addNotification(
            'job_assigned',
            'New job assigned',
            `You have been assigned a ${service.toLowerCase()} job in ${area}.`,
            'worker',
            { requestId: newId, targetWorkerId: topMatch.worker.id }
          );
        }, 1500);
      }

      return newReq;
    },
    [state.requests, state.customer, state.workers, addNotification]
  );

  const assignWorker = useCallback(
    (requestId, workerId) => {
      const worker = state.workers.find((w) => w.id === workerId);
      const otp = generateOTP(requestId);
      dispatch({
        type: 'UPDATE_REQUEST',
        payload: {
          id: requestId,
          updates: { status: 'ASSIGNED', assignedWorkerId: workerId, otp },
        },
      });

      addNotification(
        'worker_assigned',
        `${worker?.name || 'Worker'} assigned`,
        `A worker has been assigned to your request.`,
        'customer',
        { requestId }
      );
      addNotification(
        'job_assigned',
        'New job assigned',
        `You have been assigned to request ${requestId}.`,
        'worker',
        { requestId, targetWorkerId: workerId }
      );
    },
    [state.workers, addNotification]
  );

  const acceptRequest = useCallback(
    (requestId) => {
      const req = state.requests.find((r) => r.id === requestId);
      if (!req) return;

      dispatch({
        type: 'UPDATE_REQUEST',
        payload: {
          id: requestId,
          updates: {
            status: 'ACCEPTED',
            timestamps: { ...req.timestamps, accepted: Date.now() },
          },
        },
      });

      const worker = state.workers.find((w) => w.id === req.assignedWorkerId);
      if (worker) {
        dispatch({
          type: 'UPDATE_WORKER',
          payload: {
            id: worker.id,
            updates: { workload: (worker.workload || 0) + 1 },
          },
        });
      }

      addNotification(
        'request_accepted',
        `${worker?.name || 'Worker'} accepted your request`,
        `Your ${req.serviceType?.toLowerCase() || 'service'} request has been accepted.`,
        'customer',
        { requestId }
      );
    },
    [state.requests, state.workers, addNotification]
  );

  const rejectRequest = useCallback(
    (requestId) => {
      const req = state.requests.find((r) => r.id === requestId);
      if (!req) return;

      dispatch({
        type: 'UPDATE_REQUEST',
        payload: {
          id: requestId,
          updates: {
            status: 'REJECTED',
            timestamps: { ...req.timestamps, rejected: Date.now() },
          },
        },
      });

      addNotification(
        'worker_rejected',
        'Worker unavailable',
        `The assigned worker could not take your request. We're looking for another match.`,
        'customer',
        { requestId }
      );
    },
    [state.requests, addNotification]
  );

  const startJob = useCallback(
    (requestId, otp) => {
      const isValid = verifyOTP(requestId, otp);
      if (!isValid) return { success: false, error: 'Invalid service code. Please try again.' };

      const req = state.requests.find((r) => r.id === requestId);
      if (!req) return { success: false, error: 'Request not found.' };

      dispatch({
        type: 'UPDATE_REQUEST',
        payload: {
          id: requestId,
          updates: {
            status: 'IN_PROGRESS',
            timestamps: { ...req.timestamps, started: Date.now() },
          },
        },
      });

      addNotification(
        'job_started',
        'Service started',
        `Your ${req.serviceType?.toLowerCase() || 'service'} has started.`,
        'customer',
        { requestId }
      );

      return { success: true };
    },
    [state.requests, addNotification]
  );

  const completeJob = useCallback(
    (requestId) => {
      const req = state.requests.find((r) => r.id === requestId);
      if (!req) return;

      dispatch({
        type: 'UPDATE_REQUEST',
        payload: {
          id: requestId,
          updates: {
            status: 'COMPLETED',
            timestamps: { ...req.timestamps, completed: Date.now() },
          },
        },
      });

      // Reduce worker workload
      const worker = state.workers.find((w) => w.id === req.assignedWorkerId);
      if (worker) {
        dispatch({
          type: 'UPDATE_WORKER',
          payload: {
            id: worker.id,
            updates: {
              workload: Math.max(0, (worker.workload || 1) - 1),
              completedJobs: (worker.completedJobs || 0) + 1,
            },
          },
        });
      }

      addNotification(
        'job_completed',
        'Service completed',
        `Your ${req.serviceType?.toLowerCase() || 'service'} has been completed.`,
        'customer',
        { requestId }
      );

      addNotification(
        'job_completed',
        'Job completed',
        `Request ${requestId} has been completed successfully.`,
        'admin',
        { requestId }
      );
    },
    [state.requests, state.workers, addNotification]
  );

  const cancelRequest = useCallback(
    (requestId) => {
      const req = state.requests.find((r) => r.id === requestId);
      if (!req) return;

      dispatch({
        type: 'UPDATE_REQUEST',
        payload: {
          id: requestId,
          updates: {
            status: 'CANCELLED',
            timestamps: { ...req.timestamps, cancelled: Date.now() },
          },
        },
      });

      addNotification(
        'request_cancelled',
        'Request cancelled',
        `Your request ${requestId} has been cancelled.`,
        'customer',
        { requestId }
      );

      if (req.assignedWorkerId) {
        addNotification(
          'request_cancelled',
          'Job cancelled',
          `Request ${requestId} has been cancelled by the customer.`,
          'worker',
          { requestId, targetWorkerId: req.assignedWorkerId }
        );

        // Reduce workload if job was accepted or in progress
        if (['ACCEPTED', 'IN_PROGRESS'].includes(req.status)) {
          const worker = state.workers.find((w) => w.id === req.assignedWorkerId);
          if (worker) {
            dispatch({
              type: 'UPDATE_WORKER',
              payload: {
                id: worker.id,
                updates: { workload: Math.max(0, (worker.workload || 1) - 1) },
              },
            });
          }
        }
      }
    },
    [state.requests, state.workers, addNotification]
  );

  // --- Worker Management ---
  const toggleWorkerAvailability = useCallback(
    (workerId) => {
      const worker = state.workers.find((w) => w.id === workerId);
      if (worker) {
        dispatch({
          type: 'UPDATE_WORKER',
          payload: { id: workerId, updates: { available: !worker.available } },
        });
      }
    },
    [state.workers]
  );

  const updateWorkerProfile = useCallback((workerId, updates) => {
    dispatch({ type: 'UPDATE_WORKER', payload: { id: workerId, updates } });
  }, []);

  // --- Reviews ---
  const submitReview = useCallback(
    (requestId, { rating, comment }) => {
      const req = state.requests.find((r) => r.id === requestId);
      if (!req || !req.assignedWorkerId) return;

      const review = {
        id: 'r-' + Date.now(),
        requestId,
        workerId: req.assignedWorkerId,
        customerId: req.customerId || 'c1',
        rating,
        comment: comment || '',
        timestamp: Date.now(),
      };

      dispatch({ type: 'ADD_REVIEW', payload: review });

      // Recalculate worker rating
      const workerReviews = [...state.reviews.filter((r) => r.workerId === req.assignedWorkerId), review];
      const avgRating = Math.round((workerReviews.reduce((sum, r) => sum + r.rating, 0) / workerReviews.length) * 10) / 10;

      dispatch({
        type: 'UPDATE_WORKER',
        payload: { id: req.assignedWorkerId, updates: { rating: avgRating } },
      });

      // Mark request as reviewed
      dispatch({
        type: 'UPDATE_REQUEST',
        payload: { id: requestId, updates: { reviewed: true } },
      });

      addNotification(
        'new_review',
        `New ${rating}-star review`,
        `You received a ${rating}-star review for request ${requestId}.`,
        'worker',
        { requestId, targetWorkerId: req.assignedWorkerId }
      );
    },
    [state.requests, state.reviews, addNotification]
  );

  // --- Notifications ---
  const markNotificationRead = useCallback((notificationId) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  }, []);

  const clearNotifications = useCallback((role) => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS', payload: role });
  }, []);

  // --- Demo ---
  const resetDemo = useCallback(() => {
    clearState();
    const seed = getInitialState();
    dispatch({ type: 'RESET_DEMO', payload: seed });
  }, []);

  // --- Computed Values ---
  const activeRequests = useMemo(
    () => state.requests.filter((r) => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(r.status)),
    [state.requests]
  );

  const completedRequests = useMemo(
    () => state.requests.filter((r) => r.status === 'COMPLETED'),
    [state.requests]
  );

  const workerStats = useMemo(
    () => ({
      total: state.workers.length,
      verified: state.workers.filter((w) => w.verified).length,
      available: state.workers.filter((w) => w.available).length,
      active: state.workers.filter((w) => (w.workload || 0) > 0).length,
      pendingVerification: state.workers.filter((w) => !w.verified).length,
    }),
    [state.workers]
  );

  const requestStats = useMemo(() => {
    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return {
      total: state.requests.length,
      active: activeRequests.length,
      completed: completedRequests.length,
      cancelled: state.requests.filter((r) => r.status === 'CANCELLED').length,
      today: state.requests.filter((r) => {
        const created = r.timestamps?.created || new Date(r.timestamp).getTime();
        return created >= todayStart.getTime();
      }).length,
    };
  }, [state.requests, activeRequests.length, completedRequests.length]);

  const averageMatchScore = useMemo(() => {
    const scored = state.requests.filter((r) => r.matchScore && r.matchScore > 0);
    if (scored.length === 0) return 0;
    return Math.round(scored.reduce((acc, r) => acc + r.matchScore, 0) / scored.length);
  }, [state.requests]);

  const averageRating = useMemo(() => {
    if (state.reviews.length === 0) return 0;
    return Math.round((state.reviews.reduce((acc, r) => acc + r.rating, 0) / state.reviews.length) * 10) / 10;
  }, [state.reviews]);

  const getNotificationsForRole = useCallback(
    (role, workerId) => {
      return state.notifications.filter((n) => {
        if (role === 'worker') {
          return n.role === 'worker' && (!n.targetWorkerId || n.targetWorkerId === workerId);
        }
        return n.role === role;
      });
    },
    [state.notifications]
  );

  const unreadNotifications = useMemo(() => {
    return getNotificationsForRole(state.currentRole, state.activeWorkerId).filter((n) => !n.read);
  }, [state.currentRole, state.activeWorkerId, getNotificationsForRole]);

  const getWorkerById = useCallback(
    (workerId) => state.workers.find((w) => w.id === workerId),
    [state.workers]
  );

  const getRequestById = useCallback(
    (requestId) => state.requests.find((r) => r.id === requestId),
    [state.requests]
  );

  const value = {
    ...state,
    // Actions
    setRole,
    setActiveWorker,
    createRequest,
    assignWorker,
    acceptRequest,
    rejectRequest,
    startJob,
    completeJob,
    cancelRequest,
    toggleWorkerAvailability,
    updateWorkerProfile,
    submitReview,
    markNotificationRead,
    clearNotifications,
    resetDemo,
    // Computed
    activeRequests,
    completedRequests,
    workerStats,
    requestStats,
    averageMatchScore,
    averageRating,
    unreadNotifications,
    getNotificationsForRole,
    getWorkerById,
    getRequestById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
