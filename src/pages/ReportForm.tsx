import React, { useState } from 'react';
import { PollutionType, SeverityLevel, PollutionReport } from '../types.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { PollutionMap } from '../components/PollutionMap.tsx';
import { SeverityBadge } from '../components/SeverityBadge.tsx';
import {
  Wind,
  Droplet,
  Trash2,
  Volume2,
  Factory,
  HelpCircle,
  Sparkles,
  MapPin,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  X,
  Crosshair,
  ShieldAlert,
  Loader2,
  FileCheck,
} from 'lucide-react';

interface ReportFormProps {
  onReportCreated: (newReport: PollutionReport) => void;
  onNavigate: (tab: string, reportId?: string) => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onReportCreated, onNavigate }) => {
  const { user, showToast } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedReport, setConfirmedReport] = useState<PollutionReport | null>(null);

  // Form Fields
  const [pollutionType, setPollutionType] = useState<PollutionType>('air');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('medium');
  const [source, setSource] = useState('');
  const [suspectedEntity, setSuspectedEntity] = useState('');
  const [reportedDate, setReportedDate] = useState(new Date().toISOString().slice(0, 16));

  // Location Fields
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [address, setAddress] = useState('Market Street & 4th, Civic Center');
  const [city, setCity] = useState('San Francisco');

  // Evidence Images
  const [images, setImages] = useState<{ image_url: string; caption: string }[]>([
    {
      image_url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1000&q=80',
      caption: 'Initial photo evidence',
    },
  ]);

  // AI Assistant States
  const [aiAnalyzingText, setAiAnalyzingText] = useState(false);
  const [aiTextResult, setAiTextResult] = useState<any>(null);
  const [aiAnalyzingImage, setAiAnalyzingImage] = useState(false);
  const [aiImageResult, setAiImageResult] = useState<any>(null);

  // Duplicate Check
  const [duplicateCheckResult, setDuplicateCheckResult] = useState<any>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  // Step 1 Categories
  const categoryOptions: { type: PollutionType; title: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: 'air', title: 'Air Pollution', desc: 'Heavy smoke, particulates, noxious chemical odor, transport exhaust', icon: Wind },
    { type: 'water', title: 'Water Pollution', desc: 'Industrial chemical runoff, stream oil sheens, sewage drainage', icon: Droplet },
    { type: 'waste', title: 'Waste Dumping', desc: 'Fly-tipping, construction debris, toxic e-waste, biohazard sharps', icon: Trash2 },
    { type: 'industrial', title: 'Industrial Spill', desc: 'Factory stack flare failures, unauthorized effluent releases', icon: Factory },
    { type: 'noise', title: 'Noise Violations', desc: 'Excessive nocturnal generator vibrations, unpermitted construction', icon: Volume2 },
    { type: 'other', title: 'Other Issue', desc: 'Ecological light pollution, chemical pesticide overspray', icon: HelpCircle },
  ];

  // AI Description Assistant
  const handleAiTextAssist = async () => {
    if (!description || description.trim().length < 5) {
      showToast('Please type a few words about what you saw first.', 'error');
      return;
    }
    setAiAnalyzingText(true);
    try {
      const res = await api.analyzeReport(description, pollutionType);
      if (res.success && res.data) {
        setAiTextResult(res.data);
        if (res.data.suggested_title) setTitle(res.data.suggested_title);
        if (res.data.suggested_severity) setSeverity(res.data.suggested_severity);
        if (res.data.suggested_category) setPollutionType(res.data.suggested_category);
        showToast('AI Assistant generated title and polished description suggestions!', 'success');
      }
    } catch (e) {
      showToast('AI Assistant temporarily unavailable.', 'error');
    } finally {
      setAiAnalyzingText(false);
    }
  };

  // AI Image Analysis
  const handleAiImageAnalyze = async (imgUrl: string) => {
    setAiAnalyzingImage(true);
    try {
      const res = await api.analyzeImage(imgUrl);
      if (res.success && res.data) {
        setAiImageResult(res.data);
        if (res.data.suggested_severity) setSeverity(res.data.suggested_severity);
        if (res.data.pollution_type) setPollutionType(res.data.pollution_type);
        showToast(`AI Vision analysis completed: ${res.data.detected_category} (${res.data.confidence}% confidence)`, 'success');
      }
    } catch (e) {
      showToast('Image analysis could not be completed.', 'error');
    } finally {
      setAiAnalyzingImage(false);
    }
  };

  // File Upload Handler (converts to base64 for real local images)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        if (base64) {
          const newImg = { image_url: base64, caption: file.name };
          setImages((prev) => [...prev, newImg]);
          handleAiImageAnalyze(base64);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Duplicate Check before final review
  const handleProceedToStep5 = async () => {
    setCheckingDuplicate(true);
    try {
      const dup = await api.checkDuplicate({
        latitude,
        longitude,
        pollution_type: pollutionType,
        title,
        description,
      });
      if (dup.success && dup.data?.is_duplicate_suspected) {
        setDuplicateCheckResult(dup.data);
      } else {
        setDuplicateCheckResult(null);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setCheckingDuplicate(false);
      setCurrentStep(5);
    }
  };

  // Current GPS Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Math.round(pos.coords.latitude * 10000) / 10000;
        const lng = Math.round(pos.coords.longitude * 10000) / 10000;
        setLatitude(lat);
        setLongitude(lng);
        setAddress(`GPS Lat: ${lat}, Long: ${lng}`);
        showToast('Coordinates retrieved from device GPS.', 'success');
      },
      () => showToast('Could not retrieve current location.', 'error')
    );
  };

  // Submission
  const handleSubmit = async () => {
    if (!title || !description) {
      showToast('Please provide a title and incident description.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        pollution_type: pollutionType,
        title,
        description,
        severity,
        source: source || 'Unspecified Point Source',
        suspected_entity: suspectedEntity,
        latitude,
        longitude,
        address,
        city,
        images,
        ai_analysis: aiImageResult || aiTextResult,
        citizen_name: user?.name || 'Concerned Citizen',
        citizen_email: user?.email || 'citizen@ecowatch.org',
        user_id: user?.id,
      };

      const res = await api.createReport(payload);
      if (res.success && res.data) {
        setConfirmedReport(res.data);
        onReportCreated(res.data);
        showToast(`Complaint registered successfully: ${res.data.report_number}`, 'success');
      } else {
        showToast(res.message || 'Error filing report.', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to submit report.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 5 Confirmation View
  if (confirmedReport) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-100">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Complaint Officially Registered
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3">Report Submitted Successfully</h2>
            <p className="text-xs text-slate-500 mt-1">
              Your report has been entered into the government environmental protection registry and dispatched for authority review.
            </p>
          </div>

          {/* Report ID Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Complaint ID</span>
                <div className="text-2xl font-black font-mono text-emerald-700">{confirmedReport.report_number}</div>
              </div>
              <SeverityBadge severity={confirmedReport.severity} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Pollution Type</span>
                <span className="font-bold text-slate-800 uppercase">{confirmedReport.pollution_type}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Initial Status</span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  {confirmedReport.status}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[11px]">Reported Location</span>
                <span className="font-semibold text-slate-700">{confirmedReport.address}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('report-details', confirmedReport.id)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Track Report Progress
            </button>
            <button
              onClick={() => {
                setConfirmedReport(null);
                setCurrentStep(1);
                setTitle('');
                setDescription('');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
          Citizen Environmental Intake
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">Submit Pollution Complaint</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete the 5-step verification wizard to lodge an actionable incident with regional environmental enforcement.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        {[
          { num: 1, label: 'Type' },
          { num: 2, label: 'Details' },
          { num: 3, label: 'Location' },
          { num: 4, label: 'Evidence' },
          { num: 5, label: 'Review' },
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => s.num < currentStep && setCurrentStep(s.num)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              s.num === currentStep
                ? 'bg-emerald-600 text-white shadow-sm'
                : s.num < currentStep
                ? 'text-emerald-700 bg-emerald-50 cursor-pointer'
                : 'text-slate-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                s.num === currentStep ? 'bg-white text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {s.num < currentStep ? '✓' : s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: POLLUTION TYPE */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Step 1: Select Pollution Category</h3>
            <p className="text-xs text-slate-500 mt-1">Choose the primary environmental category that best describes the event.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoryOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = pollutionType === opt.type;
              return (
                <div
                  key={opt.type}
                  onClick={() => setPollutionType(opt.type)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{opt.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              Continue to Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: POLLUTION DETAILS */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Step 2: Incident Details</h3>
              <p className="text-xs text-slate-500 mt-1">Provide clear factual observations to assist inspectors.</p>
            </div>
            {/* AI Assistant Button */}
            <button
              type="button"
              onClick={handleAiTextAssist}
              disabled={aiAnalyzingText}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer self-start"
            >
              {aiAnalyzingText ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {aiAnalyzingText ? 'Analyzing with AI...' : 'Polish Description with AI'}
            </button>
          </div>

          {/* AI Feedback Notification Card */}
          {aiTextResult && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Report Assistant Suggestions (Confidence: {aiTextResult.confidence}%)
              </div>
              {aiTextResult.improved_description && (
                <div>
                  <span className="font-semibold text-purple-950 block">Refined Professional Description:</span>
                  <p className="text-purple-800 bg-white p-2.5 rounded-lg border border-purple-200/80 mt-1">
                    {aiTextResult.improved_description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDescription(aiTextResult.improved_description)}
                    className="text-[11px] font-bold text-purple-700 hover:underline mt-1 cursor-pointer"
                  >
                    Apply this description
                  </button>
                </div>
              )}
              {aiTextResult.missing_information_warnings?.length > 0 && (
                <div className="pt-1">
                  <span className="font-semibold text-purple-950 block">Recommended details to check:</span>
                  <ul className="list-disc list-inside text-purple-800 text-[11px]">
                    {aiTextResult.missing_information_warnings.map((w: string, idx: number) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Report Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chemical plume flare at south industrial refinery"
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Detailed Incident Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you saw, color of discharge, stench, wildlife impacts, and approximate duration..."
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Severity Assessment *
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                >
                  <option value="low">Low - Minor nuisance, no immediate hazard</option>
                  <option value="medium">Medium - Persistent violation, moderate environmental risk</option>
                  <option value="high">High - Severe discharge, property/health threat</option>
                  <option value="critical">Critical - Acute toxic biohazard / immediate emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Date and Time of Occurrence
                </label>
                <input
                  type="datetime-local"
                  value={reportedDate}
                  onChange={(e) => setReportedDate(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Pollution Source
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. Factory Smokestack, Drainage Pipe, Construction Yard"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Suspected Entity / Organization (Optional)
                </label>
                <input
                  type="text"
                  value={suspectedEntity}
                  onChange={(e) => setSuspectedEntity(e.target.value)}
                  placeholder="e.g. Apex Refining Co, Rapid Logistics LLC"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => {
                if (!title || !description) {
                  showToast('Please fill in title and description first.', 'error');
                  return;
                }
                setCurrentStep(3);
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              Continue to Location <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: LOCATION */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Step 3: Pinpoint Location</h3>
              <p className="text-xs text-slate-500 mt-1">Click on the interactive map or click "Use Current Location".</p>
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start"
            >
              <Crosshair className="w-4 h-4 text-emerald-600" />
              Use My Current GPS
            </button>
          </div>

          {/* Interactive Leaflet Picker */}
          <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
            <PollutionMap
              reports={[]}
              height="350px"
              selectedLocation={{ lat: latitude, lng: longitude }}
              interactiveSelection={true}
              onLocationSelect={(lat, lng) => {
                setLatitude(Math.round(lat * 10000) / 10000);
                setLongitude(Math.round(lng * 10000) / 10000);
                setAddress(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                showToast(`Pin dropped at ${lat.toFixed(4)}, ${lng.toFixed(4)}`, 'info');
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Street Address / Landmark *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 840 3rd Street near pier gate"
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">City / Region *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="San Francisco"
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Coordinates</label>
              <div className="text-xs font-mono font-semibold px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => {
                if (!address) {
                  showToast('Please enter an address or click the map.', 'error');
                  return;
                }
                setCurrentStep(4);
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              Continue to Evidence <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: EVIDENCE & AI IMAGE INSPECTION */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Step 4: Photographic Evidence & AI Vision Scan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload photographs of the pollution event. Our Gemini AI model will automatically analyze visual contamination.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
            <Upload className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
            <p className="text-xs font-bold text-slate-800">Upload Pollution Photos</p>
            <p className="text-[11px] text-slate-500 mt-0.5 mb-3">Supports JPG, PNG, WEBP (Max 20MB)</p>
            <label className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md">
              <span>Select Files</span>
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* AI Image Scan Feedback Card */}
          {aiImageResult && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  AI Vision Telemetry Scan
                </div>
                <span className="text-[11px] font-black uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  Confidence: {aiImageResult.confidence}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-emerald-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Detected Environmental Issue</span>
                  <span className="font-bold text-slate-800 text-xs">{aiImageResult.detected_issue}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Recommended Severity</span>
                  <SeverityBadge severity={aiImageResult.suggested_severity} size="sm" />
                </div>
              </div>

              <p className="text-emerald-900 leading-relaxed text-[11px]">{aiImageResult.explanation}</p>
              <p className="text-[10px] text-emerald-700 italic">
                * Note: AI analysis serves as supportive intake assistance. Legal determinations remain with authorized inspectors.
              </p>
            </div>
          )}

          {/* Image Previews */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Attached Photographs ({images.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100 aspect-video">
                  <img src={img.image_url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAiImageAnalyze(img.image_url)}
                    className="absolute bottom-2 left-2 right-2 py-1 bg-slate-900/90 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400" /> Scan with AI
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleProceedToStep5}
              disabled={checkingDuplicate}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              {checkingDuplicate ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {checkingDuplicate ? 'Checking Duplicates...' : 'Review & Submit'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & FINAL SUBMIT */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Step 5: Final Review & Submission</h3>
            <p className="text-xs text-slate-500 mt-1">Confirm all details before generating your formal complaint ID.</p>
          </div>

          {/* Duplicate Detection Warning */}
          {duplicateCheckResult?.is_duplicate_suspected && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Possible Duplicate Report Detected in Area
              </div>
              <p className="text-amber-800 leading-relaxed">{duplicateCheckResult.similarity_explanation}</p>
              <p className="text-[11px] text-amber-700 font-medium">
                You may still proceed if this is an ongoing incident or if conditions have changed.
              </p>
            </div>
          )}

          {/* Full Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-slate-200">
              <div>
                <span className="text-[11px] text-slate-400 block font-bold uppercase">Pollution Category</span>
                <span className="text-base font-black text-slate-900 uppercase">{pollutionType}</span>
              </div>
              <SeverityBadge severity={severity} />
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-bold uppercase">Report Title</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{title}</p>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-bold uppercase">Detailed Statement</span>
              <p className="text-slate-700 leading-relaxed mt-0.5 whitespace-pre-wrap">{description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <span className="text-[11px] text-slate-400 block font-bold uppercase">Location</span>
                <span className="font-semibold text-slate-800">{address}, {city}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-bold uppercase">Suspected Source</span>
                <span className="font-semibold text-slate-800">{suspectedEntity || source || 'Not specified'}</span>
              </div>
            </div>

            {images.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] text-slate-400 block font-bold uppercase mb-2">Photographic Evidence</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <img key={i} src={img.image_url} alt="" className="w-16 h-12 rounded-lg object-cover border border-slate-300" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Evidence
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-emerald-600/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
              {submitting ? 'Registering with Authorities...' : 'Lodge Formal Complaint'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
