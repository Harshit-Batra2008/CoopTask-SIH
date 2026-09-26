import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, MapPin, Clock, Phone, User, CheckCircle, 
  Zap, Droplets, Hammer, Sparkles, Paintbrush, Wrench, ShieldCheck 
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { 
  Button, StatusBadge, ConfirmDialog, MatchScoreBar, MatchBreakdown
} from '../../components/ui';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';

const SERVICE_ICONS = { 
  Electrician: Zap, Plumber: Droplets, Carpenter: Hammer, Cleaner: Sparkles, Painter: Paintbrush, 'Appliance Repair': Wrench 
};

export function WorkerJobDetail({ requestId, onNavigate }) {
  const { getRequestById, activeWorkerId, customer, acceptRequest, rejectRequest, startJob, completeJob } = useApp();
  const { addToast } = useToast();
  
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const request = getRequestById(requestId);
  
  if (!request) return <div className="ct-p-4">Job not found</div>;

  const ServiceIcon = SERVICE_ICONS[request.serviceType] || Wrench;
  const match = request.matches?.find(m => m.workerId === activeWorkerId);

  const handleAccept = () => {
    acceptRequest(request.id);
    addToast({ title: 'Job Accepted', type: 'success' });
  };

  const handleReject = () => {
    rejectRequest(request.id);
    addToast({ title: 'Job Rejected', type: 'info' });
    setShowRejectConfirm(false);
    onNavigate('jobs');
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    setOtpError(false);

    if (value && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleStartJob = () => {
    const otpString = otpDigits.join('');
    if (otpString.length < 4) {
      setOtpError(true);
      return;
    }
    const result = startJob(request.id, otpString);
    if (result.success) {
      addToast({ title: 'Job Started', type: 'success' });
    } else {
      setOtpError(true);
      addToast({ title: result.error || 'Invalid OTP', type: 'error' });
    }
  };

  const handleCompleteJob = () => {
    completeJob(request.id);
    addToast({ title: 'Job Completed', type: 'success' });
    setShowCompleteConfirm(false);
  };

  return (
    <div className="ct-page ct-pb-20">
      <div className="ct-flex ct-items-center ct-mb-4">
        <button onClick={() => onNavigate('jobs')} className="ct-mr-3 ct-text-secondary ct-p-1">
          <ArrowLeft size={20} />
        </button>
        <h1 className="ct-font-bold ct-text-lg ct-flex-1">Job Details</h1>
        <StatusBadge status={request.status} size="sm" />
      </div>

      <div className="ct-card ct-p-5 ct-mb-4">
        <div className="ct-flex ct-items-center ct-gap-3 ct-mb-4">
          <div className="ct-p-3 ct-bg-green-50 ct-text-primary ct-rounded-full">
            <ServiceIcon size={24} />
          </div>
          <div>
            <h2 className="ct-font-bold ct-text-lg">{request.serviceType}</h2>
            <div className="ct-text-sm ct-text-muted">ID: {request.id}</div>
          </div>
        </div>

        <div className="ct-divider ct-my-4"></div>

        <div className="ct-flex ct-flex-col ct-gap-3">
          <div className="ct-flex ct-items-start ct-gap-3">
            <User className="ct-text-muted ct-mt-0.5" size={16} />
            <div>
              <div className="ct-text-sm ct-font-medium">{customer?.name || 'Customer'}</div>
              <div className="ct-text-xs ct-text-muted">Customer</div>
            </div>
          </div>
          <div className="ct-flex ct-items-start ct-gap-3">
            <Phone className="ct-text-muted ct-mt-0.5" size={16} />
            <div className="ct-text-sm">{customer?.phone || 'Not available'}</div>
          </div>
          <div className="ct-flex ct-items-start ct-gap-3">
            <MapPin className="ct-text-muted ct-mt-0.5" size={16} />
            <div>
              <div className="ct-text-sm">{request.address || request.area}</div>
              <div className="ct-text-xs ct-text-muted">Location</div>
            </div>
          </div>
          <div className="ct-flex ct-items-start ct-gap-3">
            <Clock className="ct-text-muted ct-mt-0.5" size={16} />
            <div className="ct-text-sm">Urgency: <span className="ct-font-medium">{request.urgency}</span></div>
          </div>
        </div>

        {request.description && (
          <div className="ct-mt-4 ct-p-3 ct-bg-gray-50 ct-rounded-md">
            <div className="ct-text-xs ct-font-medium ct-text-muted ct-mb-1">Description</div>
            <p className="ct-text-sm">{request.description}</p>
          </div>
        )}
      </div>

      {match && request.status === 'ASSIGNED' && (
        <div className="ct-card ct-p-5 ct-mb-4">
          <h3 className="ct-font-semibold ct-mb-3 ct-flex ct-items-center ct-gap-2">
            <ShieldCheck size={18} className="ct-text-primary" /> Match Analysis
          </h3>
          <div className="ct-mb-4">
            <MatchScoreBar score={match.score} size="md" showLabel />
          </div>
          {match.breakdown && <MatchBreakdown breakdown={match.breakdown} />}
        </div>
      )}

      {request.status === 'ASSIGNED' && (
        <div className="ct-flex ct-gap-3 ct-mt-6">
          <Button variant="outline" fullWidth onClick={() => setShowRejectConfirm(true)}>Reject Job</Button>
          <Button variant="primary" fullWidth onClick={handleAccept}>Accept Job</Button>
        </div>
      )}

      {request.status === 'ACCEPTED' && (
        <div className="ct-card ct-p-5 ct-mt-4 ct-border-l-4 ct-border-l-primary">
          <h3 className="ct-font-semibold ct-mb-2">Ready to Start?</h3>
          <p className="ct-text-sm ct-text-muted ct-mb-4">Ask the customer for the 4-digit OTP to start the job.</p>
          
          <div className="ct-otp-group ct-flex ct-gap-3 ct-justify-center ct-mb-4">
            {otpDigits.map((d, i) => (
              <input
                key={i}
                ref={otpRefs[i]}
                type="text"
                maxLength={1}
                className={`ct-otp-input ct-w-12 ct-h-14 ct-text-center ct-text-xl ct-font-bold ct-border ct-rounded-md ${otpError ? 'ct-border-red-500' : 'ct-border-gray-300'} focus:ct-border-primary focus:ct-outline-none`}
                value={d}
                onChange={(e) => handleOtpChange(i, e.target.value)}
              />
            ))}
          </div>
          
          {otpError && <p className="ct-text-red-500 ct-text-xs ct-text-center ct-mb-3">Invalid OTP. Please check with customer.</p>}
          
          <Button variant="primary" fullWidth onClick={handleStartJob}>Start Job</Button>
        </div>
      )}

      {request.status === 'IN_PROGRESS' && (
        <div className="ct-card ct-p-5 ct-mt-4">
          <div className="ct-flex ct-items-center ct-gap-3 ct-mb-4 ct-text-blue-600">
            <Clock className="ct-animate-pulse" size={20} />
            <span className="ct-font-semibold">Job in Progress</span>
          </div>
          <p className="ct-text-sm ct-text-muted ct-mb-4">Mark as complete once you have finished the work.</p>
          <Button variant="primary" fullWidth onClick={() => setShowCompleteConfirm(true)}>Mark as Complete</Button>
        </div>
      )}

      {request.status === 'COMPLETED' && (
        <div className="ct-card ct-p-5 ct-mt-4 ct-bg-green-50">
          <div className="ct-flex ct-flex-col ct-items-center ct-text-center">
            <CheckCircle size={40} className="ct-text-green-500 ct-mb-2" />
            <h3 className="ct-font-semibold ct-text-green-700">Job Completed</h3>
            <p className="ct-text-sm ct-text-green-600 ct-mt-1">
              Completed on {formatDate(request.timestamps.completed)}
            </p>
          </div>
        </div>
      )}

      <div className="ct-card ct-p-5 ct-mt-4">
        <h3 className="ct-font-semibold ct-mb-4">Timeline</h3>
        <div className="ct-timeline ct-relative ct-pl-4 ct-border-l-2 ct-border-gray-200 ct-space-y-4">
          {request.timestamps?.created && (
            <div className="ct-timeline-item ct-relative">
              <div className="ct-absolute -ct-left-[25px] ct-w-3 ct-h-3 ct-bg-gray-300 ct-rounded-full ct-mt-1"></div>
              <div className="ct-text-sm ct-font-medium">Request Created</div>
              <div className="ct-text-xs ct-text-muted">{formatDate(request.timestamps.created)}</div>
            </div>
          )}
          {request.timestamps?.accepted && (
            <div className="ct-timeline-item ct-relative">
              <div className="ct-absolute -ct-left-[25px] ct-w-3 ct-h-3 ct-bg-blue-400 ct-rounded-full ct-mt-1"></div>
              <div className="ct-text-sm ct-font-medium">Accepted</div>
              <div className="ct-text-xs ct-text-muted">{formatDate(request.timestamps.accepted)}</div>
            </div>
          )}
          {request.timestamps?.started && (
            <div className="ct-timeline-item ct-relative">
              <div className="ct-absolute -ct-left-[25px] ct-w-3 ct-h-3 ct-bg-amber-400 ct-rounded-full ct-mt-1"></div>
              <div className="ct-text-sm ct-font-medium">Started</div>
              <div className="ct-text-xs ct-text-muted">{formatDate(request.timestamps.started)}</div>
            </div>
          )}
          {request.timestamps?.completed && (
            <div className="ct-timeline-item ct-relative">
              <div className="ct-absolute -ct-left-[25px] ct-w-3 ct-h-3 ct-bg-green-500 ct-rounded-full ct-mt-1"></div>
              <div className="ct-text-sm ct-font-medium">Completed</div>
              <div className="ct-text-xs ct-text-muted">{formatDate(request.timestamps.completed)}</div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={showRejectConfirm}
        onConfirm={handleReject}
        onCancel={() => setShowRejectConfirm(false)}
        title="Reject Job"
        message="Are you sure you want to reject this job?"
        confirmText="Reject"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmDialog 
        isOpen={showCompleteConfirm}
        onConfirm={handleCompleteJob}
        onCancel={() => setShowCompleteConfirm(false)}
        title="Complete Job"
        message="Are you sure you want to mark this job as completed? This action cannot be undone."
        confirmText="Complete Job"
        cancelText="Cancel"
        variant="default"
      />
    </div>
  );
}
