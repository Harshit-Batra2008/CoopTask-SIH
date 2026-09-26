import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { 
  Zap, Droplets, Hammer, Sparkles, Paintbrush, Wrench,
  MapPin, Clock, Camera, AlertCircle, ArrowLeft, ArrowRight, Check
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { SERVICE_TYPES, AREAS, URGENCY } from '../../types';
import { LoadingState } from '../../components/ui/LoadingState';

const SERVICE_ICONS = { 
  Electrician: Zap, 
  Plumber: Droplets, 
  Carpenter: Hammer, 
  Cleaner: Sparkles, 
  Painter: Paintbrush, 
  'Appliance Repair': Wrench 
};

export function RequestFlow({ onNavigate }) {
  const { createRequest } = useApp();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    area: '',
    address: '',
    description: '',
    urgency: 'NORMAL',
    preferredTime: '',
    photo: null
  });

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handleBack = () => {
    if (step === 1) onNavigate('dashboard');
    else setStep(s => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      createRequest(formData);
      setIsSubmitting(false);
      onNavigate('requests');
    }, 1500);
  };

  if (isSubmitting) {
    return <LoadingState message="Finding the best worker for you..." />;
  }

  return (
    <div className="ct-page">
      <div className="ct-flex ct-items-center ct-mb-6">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={handleBack} />
        <h1 className="ct-font-bold ct-text-lg ct-ml-2">Book Service</h1>
      </div>

      <div className="ct-stepper ct-mb-8 ct-flex ct-justify-between ct-items-center">
        {[1, 2, 3, 4].map((s, idx) => (
          <React.Fragment key={s}>
            <div className={`ct-step ${step === s ? 'ct-step-active' : step > s ? 'ct-step-done' : 'ct-step-pending'} ct-flex-col ct-items-center ct-gap-1`}>
              <div className="ct-step-number w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2">
                {step > s ? <Check size={16} /> : s}
              </div>
              <span className="ct-step-label ct-text-xs">{['Service', 'Location', 'Details', 'Review'][s-1]}</span>
            </div>
            {idx < 3 && <div className={`ct-step-connector flex-1 h-1 mx-2 rounded ${step > s ? 'bg-green-600' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="ct-card">
        {step === 1 && (
          <div>
            <h2 className="ct-text-lg ct-font-semibold ct-mb-4">What do you need help with?</h2>
            <div className="ct-grid-2 ct-gap-4">
              {SERVICE_TYPES.map(service => {
                const Icon = SERVICE_ICONS[service] || Zap;
                const isSelected = formData.service === service;
                return (
                  <div 
                    key={service}
                    className={`ct-service-card p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                    onClick={() => setFormData({...formData, service})}
                  >
                    <div className="ct-flex-col ct-items-center ct-text-center ct-gap-2">
                      <Icon size={32} className={isSelected ? 'text-green-700' : 'text-gray-500'} />
                      <span className="ct-font-medium">{service}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="ct-text-lg ct-font-semibold ct-mb-4">Where do you need the service?</h2>
            <div className="ct-flex-col ct-gap-4">
              <Select 
                label="Area" 
                options={AREAS} 
                value={formData.area} 
                onChange={(e) => setFormData({...formData, area: e.target.value})} 
              />
              <Input 
                label="Full Address" 
                icon={MapPin} 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
                placeholder="House no, Building, Street"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="ct-text-lg ct-font-semibold ct-mb-4">Request Details</h2>
            <div className="ct-flex-col ct-gap-6">
              <Textarea 
                label="Describe the issue" 
                maxLength={500} 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Please describe what needs to be fixed..."
              />
              
              <div>
                <label className="ct-text-sm ct-font-medium ct-mb-2 block">Urgency</label>
                <div className="ct-flex-col ct-gap-2">
                  {Object.values(URGENCY).map(u => (
                    <div 
                      key={u}
                      className={`p-3 rounded-lg border cursor-pointer ${formData.urgency === u ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}
                      onClick={() => setFormData({...formData, urgency: u})}
                    >
                      <div className="ct-flex ct-items-center ct-gap-2">
                        <AlertCircle size={18} className={formData.urgency === u ? 'text-green-700' : 'text-gray-500'} />
                        <span className="ct-font-medium">{u}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Input 
                label="Preferred Time (Optional)" 
                icon={Clock} 
                value={formData.preferredTime} 
                onChange={(e) => setFormData({...formData, preferredTime: e.target.value})} 
                placeholder="e.g. Today evening, Tomorrow morning"
              />

              <div className="ct-photo-upload p-4 border-2 border-dashed border-gray-300 rounded-xl ct-text-center">
                <Camera size={24} className="mx-auto text-gray-400 ct-mb-2" />
                <span className="ct-text-sm ct-text-muted">Upload a photo of the issue</span>
                <input type="file" className="hidden" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="ct-text-lg ct-font-semibold ct-mb-4">Review Summary</h2>
            <div className="ct-info-box bg-gray-50 p-4 rounded-xl ct-flex-col ct-gap-4">
              <div className="ct-flex ct-justify-between">
                <span className="ct-text-muted">Service</span>
                <span className="ct-font-medium">{formData.service}</span>
              </div>
              <div className="ct-divider"></div>
              <div className="ct-flex ct-justify-between">
                <span className="ct-text-muted">Location</span>
                <span className="ct-font-medium text-right">{formData.address}, {formData.area}</span>
              </div>
              <div className="ct-divider"></div>
              <div className="ct-flex ct-justify-between">
                <span className="ct-text-muted">Urgency</span>
                <span className="ct-font-medium">{formData.urgency}</span>
              </div>
              {formData.preferredTime && (
                <>
                  <div className="ct-divider"></div>
                  <div className="ct-flex ct-justify-between">
                    <span className="ct-text-muted">Preferred Time</span>
                    <span className="ct-font-medium">{formData.preferredTime}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="ct-flex ct-gap-4 ct-mt-6">
        {step < 4 ? (
          <Button 
            variant="primary" 
            fullWidth 
            onClick={handleNext}
            disabled={(step === 1 && !formData.service) || (step === 2 && (!formData.area || !formData.address))}
          >
            Next
          </Button>
        ) : (
          <Button 
            variant="primary" 
            fullWidth 
            onClick={handleSubmit}
            icon={Check}
          >
            Confirm & Request
          </Button>
        )}
      </div>
    </div>
  );
}
