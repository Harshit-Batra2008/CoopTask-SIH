import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { 
  ArrowLeft, MapPin, Clock, Calendar, Shield, Phone, MessageSquare, 
  AlertCircle, XCircle, Star, CheckCircle2,
  Zap, Droplets, Hammer, Sparkles, Paintbrush, Wrench
} from 'lucide-react';
import { Button, StatusBadge, Avatar, StarRating, MatchScoreBar, MatchBreakdown, ConfirmDialog, Textarea } from '../../components/ui';
import { formatDate, formatTime } from '../../utils/formatters';
import { generateOTP } from '../../services/otpService';

const SERVICE_ICONS = { 
  Electrician: Zap, 
  Plumber: Droplets, 
  Carpenter: Hammer, 
  Cleaner: Sparkles, 
  Painter: Paintbrush, 
  'Appliance Repair': Wrench 
};

export function RequestDetail({ requestId, onNavigate }) {
  const { getRequestById, getWorkerById, cancelRequest, submitReview } = useApp();
  
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const request = getRequestById(requestId);
  
  if (!request) {
    return (
      <div className="ct-page ct-flex-col ct-items-center ct-justify-center ct-text-center py-12">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="ct-text-xl ct-font-bold mb-2">Request Not Found</h2>
        <Button variant="primary" onClick={() => onNavigate('requests')}>Back to Requests</Button>
      </div>
    );
  }

  const worker = request.assignedWorkerId ? getWorkerById(request.assignedWorkerId) : null;
  const match = request.matches?.find(m => m.workerId === request.assignedWorkerId);
  const Icon = SERVICE_ICONS[request.serviceType] || Zap;
  
  const isCancellable = ['REQUESTED', 'MATCHING', 'ASSIGNED', 'ACCEPTED'].includes(request.status);
  
  const handleCancel = () => {
    cancelRequest(request.id);
    setShowCancelDialog(false);
  };

  const handleSubmitReview = () => {
    if (rating > 0) {
      submitReview(request.id, { rating, comment });
    }
  };

  return (
    <div className="ct-page pb-24">
      <div className="ct-flex ct-items-center ct-mb-6">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => onNavigate('requests')} />
        <h1 className="ct-font-bold ct-text-lg ct-ml-2">Request Details</h1>
      </div>

      <div className="ct-card ct-mb-6">
        <div className="ct-flex ct-justify-between ct-items-start ct-mb-4">
          <div className="ct-flex ct-gap-3">
            <div className="ct-service-icon bg-green-50 p-3 rounded-xl text-green-700">
              <Icon size={24} />
            </div>
            <div>
              <h2 className="ct-font-bold ct-text-xl">{request.serviceType}</h2>
              <span className="text-xs text-gray-500 font-mono">{request.id}</span>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>
        
        <div className="ct-divider ct-my-4"></div>
        
        <div className="ct-flex-col ct-gap-3">
          <div className="ct-flex ct-items-start ct-gap-3">
            <MapPin size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="ct-text-sm ct-font-medium">{request.area}</p>
              <p className="ct-text-sm ct-text-muted">{request.address}</p>
            </div>
          </div>
          
          <div className="ct-flex ct-items-start ct-gap-3">
            <Calendar size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="ct-text-sm ct-font-medium">{formatDate(request.timestamps?.created)}</p>
              <p className="ct-text-sm ct-text-muted">at {formatTime(request.timestamps?.created)}</p>
            </div>
          </div>

          {request.description && (
            <div className="ct-bg-gray-50 p-3 rounded-lg mt-2">
              <p className="ct-text-sm text-gray-700">{request.description}</p>
            </div>
          )}
        </div>
      </div>

      {request.status === 'ACCEPTED' && (
        <div className="ct-card bg-green-50 border border-green-200 ct-mb-6">
          <div className="ct-text-center">
            <h3 className="ct-font-semibold text-green-800 ct-mb-2">Service OTP</h3>
            <p className="ct-text-sm text-green-600 ct-mb-4">Share this code with the worker when they arrive</p>
            <div className="ct-otp-group flex justify-center gap-2">
              {generateOTP(request.id).split('').map((digit, i) => (
                <div key={i} className="ct-otp-input w-12 h-14 bg-white rounded-lg border-2 border-green-300 flex items-center justify-center text-2xl font-bold text-green-700">
                  {digit}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {worker && (
        <div className="ct-section ct-mb-6">
          <h3 className="ct-section-title ct-mb-4">Assigned Professional</h3>
          <div className="ct-card">
            <div className="ct-flex ct-items-center ct-gap-4 ct-mb-4">
              <Avatar name={worker.name} size="lg" verified={worker.verified} />
              <div className="flex-1">
                <h4 className="ct-font-bold ct-text-lg">{worker.name}</h4>
                <div className="ct-flex ct-items-center ct-gap-2 ct-text-sm text-yellow-600">
                  <Star size={16} className="fill-current" />
                  <span className="font-medium">{worker.rating}</span>
                  <span className="text-gray-400">({worker.completedJobs} jobs)</span>
                </div>
              </div>
            </div>
            
            <div className="ct-flex ct-gap-2">
              <Button variant="outline" icon={Phone} className="flex-1">Call</Button>
              <Button variant="outline" icon={MessageSquare} className="flex-1">Message</Button>
            </div>

            {match && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">FairMatch Score</span>
                  <span className="text-sm font-bold text-green-700">{match.score}%</span>
                </div>
                <MatchScoreBar score={match.score} />
                <div className="mt-3">
                  <MatchBreakdown breakdown={match.breakdown} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="ct-section ct-mb-6">
        <h3 className="ct-section-title ct-mb-4">Request Status</h3>
        <div className="ct-timeline pl-2">
          <div className="ct-timeline-item relative pb-6 border-l-2 border-green-500 pl-4">
            <div className="ct-timeline-dot absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1"></div>
            <p className="ct-timeline-title font-medium text-sm">Request Created</p>
            <p className="ct-timeline-time text-xs text-gray-500">{formatTime(request.timestamps?.created)}</p>
          </div>
          
          {request.matches?.length > 0 && (
            <div className="ct-timeline-item relative pb-6 border-l-2 border-green-500 pl-4">
              <div className="ct-timeline-dot absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1"></div>
              <p className="ct-timeline-title font-medium text-sm">Workers Matched</p>
            </div>
          )}
          
          {request.assignedWorkerId && (
            <div className={`ct-timeline-item relative pb-6 border-l-2 ${request.timestamps?.accepted ? 'border-green-500' : 'border-gray-200'} pl-4`}>
              <div className="ct-timeline-dot absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1"></div>
              <p className="ct-timeline-title font-medium text-sm">Worker Assigned</p>
            </div>
          )}
          
          {request.timestamps?.accepted && (
            <div className={`ct-timeline-item relative pb-6 border-l-2 ${request.timestamps?.started ? 'border-green-500' : 'border-gray-200'} pl-4`}>
              <div className="ct-timeline-dot absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1"></div>
              <p className="ct-timeline-title font-medium text-sm">Worker Accepted</p>
              <p className="ct-timeline-time text-xs text-gray-500">{formatTime(request.timestamps?.accepted)}</p>
            </div>
          )}

          {request.timestamps?.started && (
            <div className={`ct-timeline-item relative pb-6 border-l-2 ${request.timestamps?.completed ? 'border-green-500' : 'border-gray-200'} pl-4`}>
              <div className="ct-timeline-dot absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1"></div>
              <p className="ct-timeline-title font-medium text-sm">Service Started</p>
              <p className="ct-timeline-time text-xs text-gray-500">{formatTime(request.timestamps?.started)}</p>
            </div>
          )}

          {request.timestamps?.completed && (
            <div className="ct-timeline-item relative pl-4">
              <div className="ct-timeline-dot absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1"></div>
              <p className="ct-timeline-title font-medium text-sm">Service Completed</p>
              <p className="ct-timeline-time text-xs text-gray-500">{formatTime(request.timestamps?.completed)}</p>
            </div>
          )}
        </div>
      </div>

      {request.status === 'COMPLETED' && !request.reviewed && (
        <div className="ct-section ct-mb-6">
          <h3 className="ct-section-title ct-mb-4">Rate & Review</h3>
          <div className="ct-card">
            <div className="flex justify-center mb-4">
              <StarRating rating={rating} size="lg" interactive onChange={setRating} />
            </div>
            <Textarea 
              placeholder="Leave a comment about the service..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4"
            />
            <Button variant="primary" fullWidth onClick={handleSubmitReview} disabled={rating === 0}>
              Submit Review
            </Button>
          </div>
        </div>
      )}

      {isCancellable && (
        <div className="ct-mt-8">
          <Button variant="danger" icon={XCircle} fullWidth onClick={() => setShowCancelDialog(true)}>
            Cancel Request
          </Button>
        </div>
      )}

      <ConfirmDialog 
        isOpen={showCancelDialog}
        onCancel={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Cancel Request"
        message="Are you sure you want to cancel this request? This action cannot be undone."
        confirmText="Yes, Cancel"
        variant="danger"
      />
    </div>
  );
}
