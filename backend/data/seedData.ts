import { PollutionReport, User, Notification } from '../../src/types.ts';

export const SEED_USERS: (User & { password_hash: string })[] = [
  {
    id: 'usr-admin-1',
    name: 'Dr. Evelyn Vance',
    email: 'admin@ecowatch.gov',
    password_hash: '$2a$10$wT0l0hX5Kz0qf4V3j7yOse4fU2b/N4W1K0y5L2R4yQ2cZ3l8v1Yyq', // password123
    role: 'admin',
    department: 'Central Environmental Protection Authority',
    phone: '+1 (555) 019-2831',
    status: 'active',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr-officer-1',
    name: 'Marcus Chen',
    email: 'officer.chen@ecowatch.gov',
    password_hash: '$2a$10$wT0l0hX5Kz0qf4V3j7yOse4fU2b/N4W1K0y5L2R4yQ2cZ3l8v1Yyq', // password123
    role: 'officer',
    department: 'Industrial Waste & Water Quality Division',
    phone: '+1 (555) 019-4421',
    status: 'active',
    created_at: '2026-01-12T09:30:00Z',
  },
  {
    id: 'usr-officer-2',
    name: 'Sarah Jenkins',
    email: 'officer.jenkins@ecowatch.gov',
    password_hash: '$2a$10$wT0l0hX5Kz0qf4V3j7yOse4fU2b/N4W1K0y5L2R4yQ2cZ3l8v1Yyq', // password123
    role: 'officer',
    department: 'Air Pollution Control & Acoustic Health',
    phone: '+1 (555) 019-7712',
    status: 'active',
    created_at: '2026-01-15T11:00:00Z',
  },
  {
    id: 'usr-citizen-1',
    name: 'Elena Rostova',
    email: 'citizen@ecowatch.org',
    password_hash: '$2a$10$wT0l0hX5Kz0qf4V3j7yOse4fU2b/N4W1K0y5L2R4yQ2cZ3l8v1Yyq', // password123
    role: 'citizen',
    phone: '+1 (555) 014-8899',
    status: 'active',
    created_at: '2026-02-01T14:20:00Z',
  },
  {
    id: 'usr-citizen-2',
    name: 'David K. Miller',
    email: 'david.miller@example.com',
    password_hash: '$2a$10$wT0l0hX5Kz0qf4V3j7yOse4fU2b/N4W1K0y5L2R4yQ2cZ3l8v1Yyq',
    role: 'citizen',
    phone: '+1 (555) 012-3490',
    status: 'active',
    created_at: '2026-02-10T16:00:00Z',
  }
];

export const SEED_REPORTS: PollutionReport[] = [
  {
    id: 'rep-001',
    report_number: 'ECO-2026-000101',
    user_id: 'usr-citizen-1',
    citizen_name: 'Elena Rostova',
    citizen_email: 'citizen@ecowatch.org',
    pollution_type: 'industrial',
    title: 'Dense Chemical Smoke & Particulate Flare from Refinery',
    description: 'Black sulfury smoke billowing non-stop from the western flare stack since early dawn. A distinct pungent egg/sulfur stench is permeating the nearby residential perimeter, causing stinging eyes and coughing.',
    severity: 'critical',
    status: 'Under Investigation',
    source: 'Industrial Chemical Flare Stack',
    suspected_entity: 'Apex Petrochemical Processing Hub',
    latitude: 37.7842,
    longitude: -122.3951,
    address: '840 3rd Street, South Bay Waterfront',
    city: 'San Francisco',
    reported_at: '2026-09-28T07:15:00Z',
    updated_at: '2026-09-29T10:30:00Z',
    images: [
      {
        id: 'img-101',
        report_id: 'rep-001',
        image_url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1000&q=80',
        caption: 'Heavy particulate plume from refinery stack at dawn',
        uploaded_at: '2026-09-28T07:15:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-101-1',
        report_id: 'rep-001',
        old_status: 'Submitted',
        new_status: 'Under Review',
        changed_by_name: 'Dr. Evelyn Vance',
        changed_by_role: 'admin',
        remarks: 'Report flagged with Critical Severity. Dispatched for rapid containment priority.',
        changed_at: '2026-09-28T08:00:00Z'
      },
      {
        id: 'hist-101-2',
        report_id: 'rep-001',
        old_status: 'Under Review',
        new_status: 'Verified',
        changed_by_name: 'Dr. Evelyn Vance',
        changed_by_role: 'admin',
        remarks: 'Air quality telemetry at station SF-04 confirms severe PM2.5 and VOC spike.',
        changed_at: '2026-09-28T08:45:00Z'
      },
      {
        id: 'hist-101-3',
        report_id: 'rep-001',
        old_status: 'Verified',
        new_status: 'Assigned',
        changed_by_name: 'Dr. Evelyn Vance',
        changed_by_role: 'admin',
        remarks: 'Assigned to Officer Sarah Jenkins (Air Pollution Control Division).',
        changed_at: '2026-09-28T09:10:00Z'
      },
      {
        id: 'hist-101-4',
        report_id: 'rep-001',
        old_status: 'Assigned',
        new_status: 'Under Investigation',
        changed_by_name: 'Sarah Jenkins',
        changed_by_role: 'officer',
        remarks: 'Mobile sensor deployment and plant perimeter acoustic/optical survey in progress.',
        changed_at: '2026-09-29T10:30:00Z'
      }
    ],
    assignments: [
      {
        id: 'asg-101',
        report_id: 'rep-001',
        officer_id: 'usr-officer-2',
        officer_name: 'Sarah Jenkins',
        assigned_by_name: 'Dr. Evelyn Vance',
        department: 'Air Pollution Control & Acoustic Health',
        notes: 'Priority 1: Conduct instant volatile organic compounds (VOC) laser spectrometry.',
        assigned_at: '2026-09-28T09:10:00Z'
      }
    ],
    investigation_notes: [
      {
        id: 'note-101',
        report_id: 'rep-001',
        officer_name: 'Sarah Jenkins',
        notes: 'On-site FLIR optical gas imaging revealed pressure relief valve failure on bypass tank #4. Formal notice of violation served to plant safety superintendent.',
        verification_image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
        created_at: '2026-09-29T10:30:00Z'
      }
    ],
    actions_taken: [],
    ai_analysis: {
      detected_category: 'Industrial Air Pollution',
      confidence: 96,
      suggested_severity: 'critical',
      analysis_text: 'High opacity hydrocarbon flare with heavy particulate concentration detected. Immediate health risk for respiratory sensitivities downwind.',
      suggested_title: 'Uncontrolled Refinery Flare Emission',
      improved_description: 'Continuous black sulfury plume discharging from chemical refinery flare stack with elevated volatile organic compound markers.'
    }
  },
  {
    id: 'rep-002',
    report_number: 'ECO-2026-000102',
    user_id: 'usr-citizen-2',
    citizen_name: 'David K. Miller',
    citizen_email: 'david.miller@example.com',
    pollution_type: 'water',
    title: 'Toxic Cyan / Fluorescent Runoff in North Creek Basin',
    description: 'Noticed a bright neon-blue and oily film spreading rapidly across North Creek behind the commercial industrial park. Dead fish and amphibians floating along the bank edge.',
    severity: 'critical',
    status: 'Action Taken',
    source: 'Storm Drainage Discharge',
    suspected_entity: 'Precision Metal Plating Works',
    latitude: 37.7915,
    longitude: -122.4089,
    address: '1240 Battery Street, North Pier Wetlands',
    city: 'San Francisco',
    reported_at: '2026-09-25T14:10:00Z',
    updated_at: '2026-09-28T16:00:00Z',
    images: [
      {
        id: 'img-102',
        report_id: 'rep-002',
        image_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80',
        caption: 'Chemical coloration and foaming along creek embankment',
        uploaded_at: '2026-09-25T14:10:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-102-1',
        report_id: 'rep-002',
        old_status: 'Submitted',
        new_status: 'Verified',
        changed_by_name: 'Dr. Evelyn Vance',
        changed_by_role: 'admin',
        remarks: 'Water sample dispatch requested immediately.',
        changed_at: '2026-09-25T15:00:00Z'
      },
      {
        id: 'hist-102-2',
        report_id: 'rep-002',
        old_status: 'Verified',
        new_status: 'Under Investigation',
        changed_by_name: 'Marcus Chen',
        changed_by_role: 'officer',
        remarks: 'Deployed floating oil containment boom and took grab samples.',
        changed_at: '2026-09-26T09:00:00Z'
      },
      {
        id: 'hist-102-3',
        report_id: 'rep-002',
        old_status: 'Under Investigation',
        new_status: 'Action Taken',
        changed_by_name: 'Marcus Chen',
        changed_by_role: 'officer',
        remarks: 'Contaminated outfall pipe plugged with inflatable pneumatic stopper. Responsible facility shut down pending clean-up.',
        changed_at: '2026-09-28T16:00:00Z'
      }
    ],
    assignments: [
      {
        id: 'asg-102',
        report_id: 'rep-002',
        officer_id: 'usr-officer-1',
        officer_name: 'Marcus Chen',
        assigned_by_name: 'Dr. Evelyn Vance',
        department: 'Industrial Waste & Water Quality Division',
        notes: 'Take water samples for heavy metals, copper, and cyanides.',
        assigned_at: '2026-09-25T15:10:00Z'
      }
    ],
    investigation_notes: [
      {
        id: 'note-102',
        report_id: 'rep-002',
        officer_name: 'Marcus Chen',
        notes: 'Laboratory spectroscopy detected hexavalent chromium and acid rinse water. Outfall traced directly to illegal underground junction box behind unit C.',
        verification_image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
        created_at: '2026-09-27T11:00:00Z'
      }
    ],
    actions_taken: [
      {
        id: 'act-102',
        report_id: 'rep-002',
        officer_name: 'Marcus Chen',
        action_title: 'Emergency Containment Boom & Injunction Order',
        action_details: 'Installed 300 meters of sorbent boom to trap floating contaminants. Issued mandatory Cease and Desist Order #ENV-8842 against Precision Metal Plating.',
        action_date: '2026-09-28T15:30:00Z',
        resolved_at: undefined
      }
    ],
    ai_analysis: {
      detected_category: 'Water Contamination / Heavy Metals',
      confidence: 94,
      suggested_severity: 'critical',
      analysis_text: 'Surface sheen, artificial pigmentation, and aquatic mortality indicator confirmed.',
      suggested_title: 'Illegal Chemical Discharge into Fresh Waterway',
      improved_description: 'Suspicious neon-colored chemical effluent flowing through storm drain into sensitive creek habitat with immediate bio-toxicity indicators.'
    }
  },
  {
    id: 'rep-003',
    report_number: 'ECO-2026-000103',
    user_id: 'usr-citizen-1',
    citizen_name: 'Elena Rostova',
    citizen_email: 'citizen@ecowatch.org',
    pollution_type: 'waste',
    title: 'Massive Illicit Tire and Construction Dumping in Forest Reserve',
    description: 'Over 200 automotive tires, crushed drywall, and fiber insulation dumped illegally overnight along the fire access road. Obstructing emergency vehicles and creating severe mosquito and fire hazard.',
    severity: 'high',
    status: 'Resolved',
    source: 'Commercial Truck Dumping',
    suspected_entity: 'Unknown rogue contractor truck',
    latitude: 37.7612,
    longitude: -122.4498,
    address: 'Twin Peaks Scenic Reserve, Access Gate 3',
    city: 'San Francisco',
    reported_at: '2026-09-20T06:30:00Z',
    updated_at: '2026-09-24T17:00:00Z',
    images: [
      {
        id: 'img-103',
        report_id: 'rep-003',
        image_url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1000&q=80',
        caption: 'Piles of discarded tires and construction waste blocking roadway',
        uploaded_at: '2026-09-20T06:30:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-103-1',
        report_id: 'rep-003',
        old_status: 'Submitted',
        new_status: 'Verified',
        changed_by_name: 'Dr. Evelyn Vance',
        changed_by_role: 'admin',
        remarks: 'Park ranger verified roadside fly-tipping.',
        changed_at: '2026-09-20T09:00:00Z'
      },
      {
        id: 'hist-103-2',
        report_id: 'rep-003',
        old_status: 'Verified',
        new_status: 'Under Investigation',
        changed_by_name: 'Marcus Chen',
        changed_by_role: 'officer',
        remarks: 'Investigated site; found delivery manifests linking to local tire recycling contractor.',
        changed_at: '2026-09-21T10:00:00Z'
      },
      {
        id: 'hist-103-3',
        report_id: 'rep-003',
        old_status: 'Under Investigation',
        new_status: 'Action Taken',
        changed_by_name: 'Marcus Chen',
        changed_by_role: 'officer',
        remarks: 'Clean-up taskforce mobilized. Dump site cleared in 48 hours.',
        changed_at: '2026-09-23T14:00:00Z'
      },
      {
        id: 'hist-103-4',
        report_id: 'rep-003',
        old_status: 'Action Taken',
        new_status: 'Resolved',
        changed_by_name: 'Dr. Evelyn Vance',
        changed_by_role: 'admin',
        remarks: 'Site fully cleared, trail reopened, surveillance trail cameras installed.',
        changed_at: '2026-09-24T17:00:00Z'
      }
    ],
    assignments: [
      {
        id: 'asg-103',
        report_id: 'rep-003',
        officer_id: 'usr-officer-1',
        officer_name: 'Marcus Chen',
        assigned_by_name: 'Dr. Evelyn Vance',
        department: 'Industrial Waste & Water Quality Division',
        notes: 'Inspect for identifying bills or barcodes to locate perpetrator.',
        assigned_at: '2026-09-20T09:30:00Z'
      }
    ],
    investigation_notes: [
      {
        id: 'note-103',
        report_id: 'rep-003',
        officer_name: 'Marcus Chen',
        notes: 'Recovered shipping invoice from debris pile. Offender identified as Rapid Haulage LLC. Civil citation and $15,000 environmental remediation penalty issued.',
        verification_image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80',
        created_at: '2026-09-21T16:00:00Z'
      }
    ],
    actions_taken: [
      {
        id: 'act-103',
        report_id: 'rep-003',
        officer_name: 'Marcus Chen',
        action_title: 'Complete Waste Clearance & Environmental Remediation',
        action_details: 'Municipal waste department removed 8.4 tons of debris for certified recycling. High-definition motion sensor cameras mounted on gate post.',
        action_date: '2026-09-24T16:00:00Z',
        resolved_at: '2026-09-24T17:00:00Z'
      }
    ],
    ai_analysis: {
      detected_category: 'Solid Waste / Fly-Tipping',
      confidence: 97,
      suggested_severity: 'high',
      analysis_text: 'Large-scale commercial illegal dumping detected. Severe combustibility and vector breeding risk.',
      suggested_title: 'Commercial Solid Waste & Tire Dumping',
      improved_description: 'Extensive unauthorized fly-tipping of automotive tires and demolition materials on public reserve land.'
    }
  },
  {
    id: 'rep-004',
    report_number: 'ECO-2026-000104',
    user_id: 'usr-citizen-2',
    citizen_name: 'David K. Miller',
    citizen_email: 'david.miller@example.com',
    pollution_type: 'noise',
    title: 'Excessive Nighttime Industrial Generator Decibel Violations',
    description: 'Heavy diesel backup generator running at over 88 dB continuously between 11 PM and 5 AM. Rhythmic vibration shakes apartment windows across 3 residential blocks.',
    severity: 'medium',
    status: 'Verified',
    source: 'Stationary Diesel Backup Generator',
    suspected_entity: 'Apex Data Storage Facility',
    latitude: 37.7765,
    longitude: -122.4172,
    address: '250 11th Street, SOMA Tech Corridor',
    city: 'San Francisco',
    reported_at: '2026-09-27T23:45:00Z',
    updated_at: '2026-09-28T11:00:00Z',
    images: [
      {
        id: 'img-104',
        report_id: 'rep-004',
        image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
        caption: 'External cooling intake and diesel generator array',
        uploaded_at: '2026-09-27T23:45:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-104-1',
        report_id: 'rep-004',
        old_status: 'Submitted',
        new_status: 'Verified',
        changed_by_name: 'Sarah Jenkins',
        changed_by_role: 'officer',
        remarks: 'Nighttime acoustic sensors recorded continuous 87.4 dB at property boundary (limit is 55 dB).',
        changed_at: '2026-09-28T11:00:00Z'
      }
    ],
    assignments: [
      {
        id: 'asg-104',
        report_id: 'rep-004',
        officer_id: 'usr-officer-2',
        officer_name: 'Sarah Jenkins',
        assigned_by_name: 'Dr. Evelyn Vance',
        department: 'Air Pollution Control & Acoustic Health',
        notes: 'Issue sound baffle installation mandate to property management.',
        assigned_at: '2026-09-28T11:30:00Z'
      }
    ],
    investigation_notes: [],
    actions_taken: [],
    ai_analysis: {
      detected_category: 'Acoustic / Noise Pollution',
      confidence: 90,
      suggested_severity: 'medium',
      analysis_text: 'Prolonged industrial noise above ambient residential thresholds. Potential sleep disturbance violation.',
      suggested_title: 'Nighttime Heavy Machinery Noise Infraction',
      improved_description: 'Continuous low-frequency acoustic disturbance and vibration exceeding municipal night ordinance thresholds.'
    }
  },
  {
    id: 'rep-005',
    report_number: 'ECO-2026-000105',
    user_id: 'usr-citizen-1',
    citizen_name: 'Elena Rostova',
    citizen_email: 'citizen@ecowatch.org',
    pollution_type: 'air',
    title: 'Unfiltered Quarry Dust Clouds Blanketing Highway 101',
    description: 'Crushed stone operations operating with broken water sprinkler curtains. Huge plumes of silica-laden white dust blowing directly across the highway reducing visibility to under 50 meters.',
    severity: 'high',
    status: 'Under Review',
    source: 'Aggregate Quarry Crusher',
    suspected_entity: 'Pacific Rock Materials',
    latitude: 37.7128,
    longitude: -122.4042,
    address: 'Bayshore Boulevard near Candlestick Point',
    city: 'San Francisco',
    reported_at: '2026-09-29T11:20:00Z',
    updated_at: '2026-09-29T12:00:00Z',
    images: [
      {
        id: 'img-105',
        report_id: 'rep-005',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
        caption: 'Fine silica dust cloud settling over freeway traffic',
        uploaded_at: '2026-09-29T11:20:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-105-1',
        report_id: 'rep-005',
        old_status: 'Submitted',
        new_status: 'Under Review',
        changed_by_name: 'Dr. Evelyn Vance',
        changed_by_role: 'admin',
        remarks: 'Reviewing highway safety correlation with state highway patrol.',
        changed_at: '2026-09-29T12:00:00Z'
      }
    ],
    assignments: [],
    investigation_notes: [],
    actions_taken: [],
    ai_analysis: {
      detected_category: 'Fugitive Dust / Mineral Particulates',
      confidence: 93,
      suggested_severity: 'high',
      analysis_text: 'High crystalline silica dispersion detected. Critical respiratory and transport hazard.',
      suggested_title: 'Uncontrolled Silica Dust Cloud Discharge',
      improved_description: 'Severe particulate matter emission resulting from disabled dust suppression systems at aggregate processing facility.'
    }
  },
  {
    id: 'rep-006',
    report_number: 'ECO-2026-000106',
    user_id: 'usr-citizen-2',
    citizen_name: 'David K. Miller',
    citizen_email: 'david.miller@example.com',
    pollution_type: 'water',
    title: 'Plastic Pellet (Nurdle) Spill Along Ocean Beach Tide Line',
    description: 'Millions of raw translucent plastic micro-beads/pellets washed ashore stretching over 2 kilometers. Seabirds actively pecking at the toxic pellets mistaking them for fish eggs.',
    severity: 'high',
    status: 'Under Investigation',
    source: 'Cargo Container Loss / Shipping Spill',
    suspected_entity: 'Trans-Pacific Freight Lines',
    latitude: 37.7595,
    longitude: -122.5107,
    address: 'Ocean Beach South, near Sloat Boulevard',
    city: 'San Francisco',
    reported_at: '2026-09-26T08:30:00Z',
    updated_at: '2026-09-27T14:15:00Z',
    images: [
      {
        id: 'img-106',
        report_id: 'rep-006',
        image_url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1000&q=80',
        caption: 'Accumulation of manufactured microplastic nurdles along high tide line',
        uploaded_at: '2026-09-26T08:30:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-106-1',
        report_id: 'rep-006',
        old_status: 'Submitted',
        new_status: 'Verified',
        changed_by_name: 'Dr. Evelyn Vance',
        changed_by_role: 'admin',
        remarks: 'Coordinated with Coast Guard Marine Environmental Protection.',
        changed_at: '2026-09-26T10:00:00Z'
      },
      {
        id: 'hist-106-2',
        report_id: 'rep-006',
        old_status: 'Verified',
        new_status: 'Under Investigation',
        changed_by_name: 'Marcus Chen',
        changed_by_role: 'officer',
        remarks: 'Volunteers and beach vacuum collectors deployed on high priority.',
        changed_at: '2026-09-27T14:15:00Z'
      }
    ],
    assignments: [
      {
        id: 'asg-106',
        report_id: 'rep-006',
        officer_id: 'usr-officer-1',
        officer_name: 'Marcus Chen',
        assigned_by_name: 'Dr. Evelyn Vance',
        department: 'Industrial Waste & Water Quality Division',
        notes: 'Quantify pellet density per square meter and coordinate coastal clean-up crews.',
        assigned_at: '2026-09-26T10:30:00Z'
      }
    ],
    investigation_notes: [
      {
        id: 'note-106',
        report_id: 'rep-006',
        officer_name: 'Marcus Chen',
        notes: 'Assessed 3 km coastline. Approximately 420 kg of pellets collected using fluidized sand screening beds so far.',
        created_at: '2026-09-27T14:15:00Z'
      }
    ],
    actions_taken: [],
    ai_analysis: {
      detected_category: 'Marine Plastic Pollution',
      confidence: 98,
      suggested_severity: 'high',
      analysis_text: 'Pre-production plastic granules present acute ingestion toxicity to avians and marine life.',
      suggested_title: 'Coastal Microplastic Pellet Wash-Up',
      improved_description: 'Extensive deposition of pre-production resin pellets along tidal littoral zone causing immediate wildlife threat.'
    }
  },
  {
    id: 'rep-007',
    report_number: 'ECO-2026-000107',
    user_id: 'usr-citizen-1',
    citizen_name: 'Elena Rostova',
    citizen_email: 'citizen@ecowatch.org',
    pollution_type: 'waste',
    title: 'Illegal Medical Bio-hazard Waste Abandoned in Alleyway',
    description: 'Multiple red biohazard puncture bags and discarded syringes found stacked behind an abandoned clinic. Bags are ripped open with stray cats foraging nearby.',
    severity: 'critical',
    status: 'Resolved',
    source: 'Unlicensed Medical Disposal',
    suspected_entity: 'Closed Urgent Care Facility',
    latitude: 37.7689,
    longitude: -122.4215,
    address: 'Caledonia Street near 16th, Mission District',
    city: 'San Francisco',
    reported_at: '2026-09-22T08:15:00Z',
    updated_at: '2026-09-23T18:00:00Z',
    images: [
      {
        id: 'img-107',
        report_id: 'rep-007',
        image_url: 'https://images.unsplash.com/photo-1583912267670-6575ad362e4b?auto=format&fit=crop&w=1000&q=80',
        caption: 'Exposed medical biohazard containers and sharps debris',
        uploaded_at: '2026-09-22T08:15:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-107-1',
        report_id: 'rep-007',
        old_status: 'Submitted',
        new_status: 'Verified',
        changed_by_name: 'Dr. Evelyn Vance',
        changed_by_role: 'admin',
        remarks: 'Immediate bio-hazard hazard protocol triggered.',
        changed_at: '2026-09-22T08:30:00Z'
      },
      {
        id: 'hist-107-2',
        report_id: 'rep-007',
        old_status: 'Verified',
        new_status: 'Resolved',
        changed_by_name: 'Marcus Chen',
        changed_by_role: 'officer',
        remarks: 'Certified HazMat squad incinerator transfer completed; area sanitized.',
        changed_at: '2026-09-23T18:00:00Z'
      }
    ],
    assignments: [
      {
        id: 'asg-107',
        report_id: 'rep-007',
        officer_id: 'usr-officer-1',
        officer_name: 'Marcus Chen',
        assigned_by_name: 'Dr. Evelyn Vance',
        department: 'Industrial Waste & Water Quality Division',
        notes: 'Emergency decontamination and Hazmat transfer manifest required.',
        assigned_at: '2026-09-22T08:35:00Z'
      }
    ],
    investigation_notes: [
      {
        id: 'note-107',
        report_id: 'rep-007',
        officer_name: 'Marcus Chen',
        notes: 'HazMat Contractor 7 secured 6 bio-boxes and sterilized alley with antimicrobial spray.',
        created_at: '2026-09-22T14:00:00Z'
      }
    ],
    actions_taken: [
      {
        id: 'act-107',
        report_id: 'rep-007',
        officer_name: 'Marcus Chen',
        action_title: 'HazMat Bio-waste Neutralization & Forensic Investigation',
        action_details: 'Proper autoclave destruction executed. Criminal indictment initiated for unlawful toxic waste abandonment.',
        action_date: '2026-09-23T17:30:00Z',
        resolved_at: '2026-09-23T18:00:00Z'
      }
    ],
    ai_analysis: {
      detected_category: 'Biomedical / Infectious Waste',
      confidence: 99,
      suggested_severity: 'critical',
      analysis_text: 'Biohazard signage and clinical sharps visible. Severe pathogen transmission vector.',
      suggested_title: 'Exposed Biohazardous Medical Waste',
      improved_description: 'Unsecured clinical biohazard receptacles containing regulated medical waste abandoned in public alley.'
    }
  },
  {
    id: 'rep-008',
    report_number: 'ECO-2026-000108',
    user_id: 'usr-citizen-2',
    citizen_name: 'David K. Miller',
    citizen_email: 'david.miller@example.com',
    pollution_type: 'air',
    title: 'Acrid Burnt Plastic Fumes from Metal Scrap Yard',
    description: 'Thick pungent smoke rising every evening around 7 PM from the rear of the scrap facility. Smells strongly of burning electrical wiring and PVC cable insulation.',
    severity: 'high',
    status: 'Verified',
    source: 'Open Wire Burning Pit',
    suspected_entity: 'Metro Metal Recyclers',
    latitude: 37.7451,
    longitude: -122.3892,
    address: '1550 Evans Avenue, Bayview District',
    city: 'San Francisco',
    reported_at: '2026-09-27T19:30:00Z',
    updated_at: '2026-09-28T09:00:00Z',
    images: [
      {
        id: 'img-108',
        report_id: 'rep-008',
        image_url: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=1000&q=80',
        caption: 'Low-lying halogen smoke plume over scrap processing yard',
        uploaded_at: '2026-09-27T19:30:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-108-1',
        report_id: 'rep-008',
        old_status: 'Submitted',
        new_status: 'Verified',
        changed_by_name: 'Sarah Jenkins',
        changed_by_role: 'officer',
        remarks: 'Night drone surveillance recorded open fire thermal signature.',
        changed_at: '2026-09-28T09:00:00Z'
      }
    ],
    assignments: [
      {
        id: 'asg-108',
        report_id: 'rep-008',
        officer_id: 'usr-officer-2',
        officer_name: 'Sarah Jenkins',
        assigned_by_name: 'Dr. Evelyn Vance',
        department: 'Air Pollution Control & Acoustic Health',
        notes: 'Execute surprise dawn inspection with municipal fire marshal.',
        assigned_at: '2026-09-28T09:30:00Z'
      }
    ],
    investigation_notes: [],
    actions_taken: [],
    ai_analysis: {
      detected_category: 'Hazardous Open Burning / Dioxins',
      confidence: 95,
      suggested_severity: 'high',
      analysis_text: 'Open burning of chlorinated plastics generates highly toxic dioxins and furans.',
      suggested_title: 'Unlawful Open Combustion of Insulated Wiring',
      improved_description: 'Nighttime open burning of copper cabling and polymers causing dense toxic halogenated smoke emissions.'
    }
  },
  {
    id: 'rep-009',
    report_number: 'ECO-2026-000109',
    user_id: 'usr-citizen-1',
    citizen_name: 'Elena Rostova',
    citizen_email: 'citizen@ecowatch.org',
    pollution_type: 'other',
    title: 'Massive Light Pollution and Laser Beams Disorienting Migratory Birds',
    description: 'High-intensity architectural skyward spotlights rotating continuously throughout the night during peak avian migration season. Dozens of disoriented birds colliding with glass towers.',
    severity: 'medium',
    status: 'Submitted',
    source: 'Architectural High-Intensity Searchlights',
    suspected_entity: 'Horizon Entertainment Complex',
    latitude: 37.7958,
    longitude: -122.3995,
    address: '400 Embarcadero Plaza',
    city: 'San Francisco',
    reported_at: '2026-09-29T22:15:00Z',
    updated_at: '2026-09-29T22:15:00Z',
    images: [
      {
        id: 'img-109',
        report_id: 'rep-009',
        image_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80',
        caption: 'Vertical multi-kilowatt beam array blinding low cloud cover',
        uploaded_at: '2026-09-29T22:15:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-109-1',
        report_id: 'rep-009',
        old_status: 'Submitted',
        new_status: 'Submitted',
        changed_by_name: 'Elena Rostova',
        changed_by_role: 'citizen',
        remarks: 'Report registered into portal.',
        changed_at: '2026-09-29T22:15:00Z'
      }
    ],
    assignments: [],
    investigation_notes: [],
    actions_taken: [],
    ai_analysis: {
      detected_category: 'Ecological Light Pollution',
      confidence: 88,
      suggested_severity: 'medium',
      analysis_text: 'Skyward projection during migratory window violates urban biodiversity dark-skies guidelines.',
      suggested_title: 'Excessive Upward Lumen Emission',
      improved_description: 'Continuous vertical high-intensity beam array interfering with nocturnal wildlife flight corridors.'
    }
  },
  {
    id: 'rep-010',
    report_number: 'ECO-2026-000110',
    user_id: 'usr-citizen-2',
    citizen_name: 'David K. Miller',
    citizen_email: 'david.miller@example.com',
    pollution_type: 'industrial',
    title: 'Discharge of Caustic Chemical Foam into Municipal Canal',
    description: 'Enormous volume of dense white chemical foam discharging into the tidal canal from an unmonitored concrete culvert. Strong chlorine/ammonia odor.',
    severity: 'high',
    status: 'Under Investigation',
    source: 'Culvert Drain Outflow',
    suspected_entity: 'Apex Detergent Manufacturing Corp',
    latitude: 37.7712,
    longitude: -122.3888,
    address: 'Mission Creek Channel near 7th Street',
    city: 'San Francisco',
    reported_at: '2026-09-28T13:40:00Z',
    updated_at: '2026-09-29T15:20:00Z',
    images: [
      {
        id: 'img-110',
        report_id: 'rep-010',
        image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
        caption: 'Thick white surfactant foam covering 400 meters of canal surface',
        uploaded_at: '2026-09-28T13:40:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-110-1',
        report_id: 'rep-010',
        old_status: 'Submitted',
        new_status: 'Verified',
        changed_by_name: 'Dr. Evelyn Vance',
        changed_by_role: 'admin',
        remarks: 'Water sampling team dispatched within 30 minutes.',
        changed_at: '2026-09-28T14:10:00Z'
      },
      {
        id: 'hist-110-2',
        report_id: 'rep-010',
        old_status: 'Verified',
        new_status: 'Under Investigation',
        changed_by_name: 'Marcus Chen',
        changed_by_role: 'officer',
        remarks: 'Foam dissipation agent tested, upstream trace in progress.',
        changed_at: '2026-09-29T15:20:00Z'
      }
    ],
    assignments: [
      {
        id: 'asg-110',
        report_id: 'rep-010',
        officer_id: 'usr-officer-1',
        officer_name: 'Marcus Chen',
        assigned_by_name: 'Dr. Evelyn Vance',
        department: 'Industrial Waste & Water Quality Division',
        notes: 'Identify surfactant concentration and verify if biodegradable.',
        assigned_at: '2026-09-28T14:30:00Z'
      }
    ],
    investigation_notes: [
      {
        id: 'note-110',
        report_id: 'rep-010',
        officer_name: 'Marcus Chen',
        notes: 'pH measured at 11.2 (extremely alkaline caustic wash). Dye tracer inserted to pinpoint factory source pipe.',
        created_at: '2026-09-29T15:20:00Z'
      }
    ],
    actions_taken: [],
    ai_analysis: {
      detected_category: 'Industrial Chemical Runoff',
      confidence: 96,
      suggested_severity: 'high',
      analysis_text: 'Dense surfactant foam formation indicative of unneutralized industrial detergent flush.',
      suggested_title: 'Alkaline Surfactant Canal Discharge',
      improved_description: 'Substantial discharge of high-pH chemical surfactant causing widespread foam blanketing over water body.'
    }
  },
  {
    id: 'rep-011',
    report_number: 'ECO-2026-000111',
    user_id: 'usr-citizen-1',
    citizen_name: 'Elena Rostova',
    citizen_email: 'citizen@ecowatch.org',
    pollution_type: 'waste',
    title: 'E-Waste and Crushed Cathode Tubes Dumped by Railroad Spur',
    description: 'Piles of crushed circuit boards, broken leaded CRT glass monitors, and leaking lead-acid battery casings abandoned along the train embankment.',
    severity: 'high',
    status: 'Verified',
    source: 'Commercial E-Waste Scrapper',
    suspected_entity: 'Circuit Cycle Salvage',
    latitude: 37.7512,
    longitude: -122.4021,
    address: 'Cesar Chavez & Illinois Street rail spur',
    city: 'San Francisco',
    reported_at: '2026-09-27T10:00:00Z',
    updated_at: '2026-09-28T14:00:00Z',
    images: [
      {
        id: 'img-111',
        report_id: 'rep-011',
        image_url: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=1000&q=80',
        caption: 'Crushed CRT monitor glass and stripped motherboards',
        uploaded_at: '2026-09-27T10:00:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-111-1',
        report_id: 'rep-011',
        old_status: 'Submitted',
        new_status: 'Verified',
        changed_by_name: 'Dr. Evelyn Vance',
        changed_by_role: 'admin',
        remarks: 'Heavy metal contamination risk verified.',
        changed_at: '2026-09-28T14:00:00Z'
      }
    ],
    assignments: [
      {
        id: 'asg-111',
        report_id: 'rep-011',
        officer_id: 'usr-officer-1',
        officer_name: 'Marcus Chen',
        assigned_by_name: 'Dr. Evelyn Vance',
        department: 'Industrial Waste & Water Quality Division',
        notes: 'Safely recover lead-bearing glass and test soil leaching.',
        assigned_at: '2026-09-28T14:15:00Z'
      }
    ],
    investigation_notes: [],
    actions_taken: [],
    ai_analysis: {
      detected_category: 'Hazardous Electronic Waste',
      confidence: 94,
      suggested_severity: 'high',
      analysis_text: 'Lead oxide in CRT glass and heavy metal soldering pose significant groundwater contamination risk.',
      suggested_title: 'Uncontained Toxic Electronic Waste Dumping',
      improved_description: 'Illicit abandonment of hazardous electronic components and lead-glass cathode ray tubes on unpaved ground.'
    }
  },
  {
    id: 'rep-012',
    report_number: 'ECO-2026-000112',
    user_id: 'usr-citizen-2',
    citizen_name: 'David K. Miller',
    citizen_email: 'david.miller@example.com',
    pollution_type: 'air',
    title: 'Severe Diesel Exhaust from Idling Freight Fleet at School Zone',
    description: 'Convoy of 14 refrigerated logistics tractor-trailers idling continuous refrigeration diesel auxiliary units directly across from McKinley Elementary playground for 6+ hours.',
    severity: 'medium',
    status: 'Resolved',
    source: 'Commercial Logistics Transport Fleet',
    suspected_entity: 'ColdExpress Logistics Fleet',
    latitude: 37.7628,
    longitude: -122.4352,
    address: 'Castro & 14th Street School Perimeter',
    city: 'San Francisco',
    reported_at: '2026-09-24T08:00:00Z',
    updated_at: '2026-09-25T16:30:00Z',
    images: [
      {
        id: 'img-112',
        report_id: 'rep-012',
        image_url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80',
        caption: 'Line of idling tractor-trailers emitting black diesel exhaust',
        uploaded_at: '2026-09-24T08:00:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-112-1',
        report_id: 'rep-012',
        old_status: 'Submitted',
        new_status: 'Verified',
        changed_by_name: 'Sarah Jenkins',
        changed_by_role: 'officer',
        remarks: 'Zero-tolerance anti-idling school zone protocol invoked.',
        changed_at: '2026-09-24T09:00:00Z'
      },
      {
        id: 'hist-112-2',
        report_id: 'rep-012',
        old_status: 'Verified',
        new_status: 'Action Taken',
        changed_by_name: 'Sarah Jenkins',
        changed_by_role: 'officer',
        remarks: 'Traffic enforcement and environmental citation issued on-scene.',
        changed_at: '2026-09-24T11:00:00Z'
      },
      {
        id: 'hist-112-3',
        report_id: 'rep-012',
        old_status: 'Action Taken',
        new_status: 'Resolved',
        changed_by_name: 'Sarah Jenkins',
        changed_by_role: 'officer',
        remarks: 'Fleet permanently rerouted to industrial staging hub with shore-power electrification.',
        changed_at: '2026-09-25T16:30:00Z'
      }
    ],
    assignments: [
      {
        id: 'asg-112',
        report_id: 'rep-012',
        officer_id: 'usr-officer-2',
        officer_name: 'Sarah Jenkins',
        assigned_by_name: 'Dr. Evelyn Vance',
        department: 'Air Pollution Control & Acoustic Health',
        notes: 'Enforce California CARB 5-minute commercial diesel anti-idling limit.',
        assigned_at: '2026-09-24T09:15:00Z'
      }
    ],
    investigation_notes: [
      {
        id: 'note-112',
        report_id: 'rep-012',
        officer_name: 'Sarah Jenkins',
        notes: 'Cited 11 tractor units for violating school zone clean air perimeter. Met with fleet logistics manager.',
        created_at: '2026-09-24T11:30:00Z'
      }
    ],
    actions_taken: [
      {
        id: 'act-112',
        report_id: 'rep-012',
        officer_name: 'Sarah Jenkins',
        action_title: 'Anti-Idling Enforcement & Designated Electric Staging Mandate',
        action_details: 'Fined carrier $4,400. ColdExpress signed binding agreement to use electrified port parking berths.',
        action_date: '2026-09-25T15:00:00Z',
        resolved_at: '2026-09-25T16:30:00Z'
      }
    ],
    ai_analysis: {
      detected_category: 'Mobile Source Particulate Emission',
      confidence: 93,
      suggested_severity: 'medium',
      analysis_text: 'Prolonged diesel particulate matter exposure in vulnerable pediatric population zone.',
      suggested_title: 'Commercial Fleet Idle Emissions Near School',
      improved_description: 'Violation of heavy-duty vehicle anti-idling statutes adjacent to primary educational facility.'
    }
  }
];

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'usr-citizen-1',
    title: 'Report Verified',
    message: 'Your report ECO-2026-000101 (Chemical Smoke Flare) has been verified by Dr. Evelyn Vance.',
    type: 'success',
    report_id: 'rep-001',
    is_read: false,
    created_at: '2026-09-28T08:45:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'usr-citizen-1',
    title: 'Officer Assigned',
    message: 'Environmental Officer Sarah Jenkins has been assigned to investigate report ECO-2026-000101.',
    type: 'info',
    report_id: 'rep-001',
    is_read: false,
    created_at: '2026-09-28T09:10:00Z',
  },
  {
    id: 'notif-3',
    user_id: 'usr-citizen-1',
    title: 'Report Resolved!',
    message: 'Great news! Your waste dumping report ECO-2026-000103 has been successfully cleaned and resolved.',
    type: 'success',
    report_id: 'rep-003',
    is_read: true,
    created_at: '2026-09-24T17:00:00Z',
  },
  {
    id: 'notif-4',
    user_id: 'usr-citizen-2',
    title: 'Action Taken',
    message: 'Immediate containment boom deployed for report ECO-2026-000102 (Runoff in Creek Basin).',
    type: 'info',
    report_id: 'rep-002',
    is_read: false,
    created_at: '2026-09-28T16:00:00Z',
  },
  {
    id: 'notif-5',
    user_id: 'usr-officer-1',
    title: 'New Investigation Assigned',
    message: 'You have been assigned to lead the probe for ECO-2026-000110 (Surfactant Canal Discharge).',
    type: 'warning',
    report_id: 'rep-010',
    is_read: false,
    created_at: '2026-09-28T14:30:00Z',
  }
];
