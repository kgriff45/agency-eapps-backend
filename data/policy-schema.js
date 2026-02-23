const policyTypes = {
  MPLI: {
    code: 'MPLI',
    label: 'Medical Professional Liability',
    icon: 'medical_services',
    pdfTemplate: 'medmal',
    fields: [
      { key: 'policy_number', label: 'Policy Number' },
      { key: 'account_name', label: 'Primary Insured' },
      { key: 'specialty', label: 'Specialty', source: 'client.specialty' },
      { key: 'npi', label: 'NPI Number', source: 'client.npi' },
      { key: 'effective_date', label: 'Effective Date' },
      { key: 'expiration_date', label: 'Expiration Date' },
      { key: 'premium', label: 'Current Premium', format: 'currency' },
    ],
    questions: [
      {
        id: 'changeDate',
        title: 'I need to change my effective date',
        description: 'Our team will coordinate with the carrier to adjust your renewal date.',
        group: 'coverage',
      },
      {
        id: 'higherLimits',
        title: "I'd like a quote comparison at higher limits",
        description: 'Request a side-by-side comparison at $2M/$6M or $3M/$9M tiers.',
        group: 'coverage',
      },
      {
        id: 'scopeChange',
        title: 'My practice scope or specialty has changed',
        description: 'New procedures, locations, or entity changes may affect your rating.',
        group: 'coverage',
      },
      {
        id: 'retiring',
        title: 'I am planning to retire',
        description: "We'll cover cancellation timing, tail requirements, costs, and next steps.",
        group: 'retirement',
      },
      {
        id: 'tailQuote',
        title: "I'd like to understand my tail coverage options now",
        description: 'No obligation — we can provide a tail quote even if retirement is not imminent.',
        group: 'retirement',
      },
    ],
    questionGroups: [
      { id: 'coverage', label: 'Coverage & Scheduling Requests' },
      { id: 'retirement', label: 'Retirement & Tail Coverage',
        notice: {
          variant: 'info',
          icon: 'lightbulb',
          body: 'Med Mal is a claims-made policy — coverage for prior acts ends when the policy lapses unless you obtain tail coverage (ERP).',
        }
      },
    ],
    endorsements: [
      {
        id: 'cyber',
        title: 'Cyber Liability Rider',
        description: 'HIPAA breaches, ransomware, and cyber incidents tied to patient records.',
        default: true,
      },
      {
        id: 'licenseDefense',
        title: 'License Defense Coverage',
        description: 'Legal costs if your medical license is under board investigation.',
        default: false,
      },
    ],
    notices: [
      {
        variant: 'warn',
        icon: 'lock',
        body: 'Policy details below are locked and managed by the carrier. Use the request section to flag any changes needed.',
      },
    ],
  },
  MMPL: {
    code: 'MMPL',
    label: 'Miscellaneous Medical Professional Liability',
    icon: 'medical_services',
    pdfTemplate: 'medmal',
    fields: [
      { key: 'policy_number', label: 'Policy Number' },
      { key: 'account_name', label: 'Primary Insured' },
      { key: 'specialty', label: 'Specialty', source: 'client.specialty' },
      { key: 'npi', label: 'NPI Number', source: 'client.npi' },
      { key: 'effective_date', label: 'Effective Date' },
      { key: 'expiration_date', label: 'Expiration Date' },
      { key: 'premium', label: 'Current Premium', format: 'currency' },
    ],
    questions: [
      {
        id: 'changeDate',
        title: 'I need to change my effective date',
        description: 'Our team will coordinate with the carrier to adjust your renewal date.',
        group: 'coverage',
      },
      {
        id: 'higherLimits',
        title: "I'd like a quote comparison at higher limits",
        description: 'Request a side-by-side comparison at $2M/$6M or $3M/$9M tiers.',
        group: 'coverage',
      },
      {
        id: 'scopeChange',
        title: 'My practice scope or specialty has changed',
        description: 'New procedures, locations, or entity changes may affect your rating.',
        group: 'coverage',
      },
      {
        id: 'retiring',
        title: 'I am planning to retire',
        description: "We'll cover cancellation timing, tail requirements, costs, and next steps.",
        group: 'retirement',
      },
      {
        id: 'tailQuote',
        title: "I'd like to understand my tail coverage options now",
        description: 'No obligation — we can provide a tail quote even if retirement is not imminent.',
        group: 'retirement',
      },
    ],
    questionGroups: [
      { id: 'coverage', label: 'Coverage & Scheduling Requests' },
      { id: 'retirement', label: 'Retirement & Tail Coverage',
        notice: {
          variant: 'info',
          icon: 'lightbulb',
          body: 'Med Mal is a claims-made policy — coverage for prior acts ends when the policy lapses unless you obtain tail coverage (ERP).',
        }
      },
    ],
    endorsements: [
      {
        id: 'cyber',
        title: 'Cyber Liability Rider',
        description: 'HIPAA breaches, ransomware, and cyber incidents tied to patient records.',
        default: true,
      },
      {
        id: 'licenseDefense',
        title: 'License Defense Coverage',
        description: 'Legal costs if your medical license is under board investigation.',
        default: false,
      },
    ],
    notices: [
      {
        variant: 'warn',
        icon: 'lock',
        body: 'Policy details below are locked and managed by the carrier. Use the request section to flag any changes needed.',
      },
    ],
  },
  AUTO: {
    code: 'AUTO',
    label: 'Automobile',
    icon: 'directions_car',
    pdfTemplate: 'auto',

    fields: [
      { key: 'policy_number', label: 'Policy Number' },
      { key: 'effective_date', label: 'Effective Date'   },
      { key: 'expiration_date', label: 'Expiration Date'  },
      { key: 'premium', label: 'Premium', format: 'currency' },
      { key: 'vehicles', label: 'Vehicles Covered' },
      { key: 'drivers', label: 'Listed Drivers'   },
    ],

    questions: [
      {
        id:          'addVehicle',
        title:       'I need to add or remove a vehicle',
        description: 'Provide year, make, model, and VIN for any changes.',
        group:       'vehicles',
      },
      {
        id:          'addDriver',
        title:       'I need to add or remove a driver',
        description: 'Changes to household drivers may affect your rate.',
        group:       'vehicles',
      },
      {
        id:          'higherLimits',
        title:       'I would like to review my liability limits',
        description: 'We can provide comparison quotes at higher coverage tiers.',
        group:       'coverage',
      },
    ],

    questionGroups: [
      { id: 'vehicles',  label: 'Vehicle & Driver Changes' },
      { id: 'coverage',  label: 'Coverage Options'         },
    ],

    endorsements: [
      {
        id:          'roadside',
        title:       'Roadside Assistance',
        description: 'Towing, battery jump, lockout, and flat tire service.',
        price:       '+$40/yr',
        default:     true,
      },
      {
        id:          'rentalReimbursement',
        title:       'Rental Reimbursement',
        description: 'Covers rental car costs while your vehicle is being repaired.',
        price:       '+$60/yr',
        default:     false,
      },
    ],

    notices: [],
  },
  CYBER: {
    code: 'CYBER',
    label: 'Cyber Liability',
    icon: 'security',
    pdfTemplate: 'cyber',

    fields: [
      { key: 'policy_number', label: 'Policy Number' },
      { key: 'effective_date', label: 'Effective Date' },
      { key: 'expiration_date', label: 'Expiration Date' },
      { key: 'premium', label: 'Premium', format: 'currency' },
    ],

    questions: [
      {
        id: 'revenueChange',
        title: 'My business revenue has significantly changed',
        description: 'Revenue is a primary rating factor for cyber policies.',
        group: 'risk',
      },
      {
        id: 'newSystems',
        title: 'We have adopted new technology systems or vendors',
        description: 'New SaaS tools, cloud migrations, or third-party processors may affect coverage.',
        group: 'risk',
      },
      {
        id: 'proassuranceMedMal',
        title: 'I recently switched my primary medical malpractice policy to ProAssurance',
        description: 'Insureds with a ProAssurance Med Mal policy may qualify for ProSecure Cyber Coverage, we will check if you qualify at renewal.',
        group: 'risk',
      },
    ],

    questionGroups: [
      { id: 'risk', label: 'Risk Profile Changes' },
    ],

    endorsements: [],
    notices:      [],
  },
  PCYB: {
    code: 'PCYB',
    label: 'ProSecure Cyber Liability',
    icon: 'security_update_good',
    pdfTemplate: 'cyber',

    fields: [
      { key: 'policy_number', label: 'Policy Number' },
      { key: 'effective_date', label: 'Effective Date' },
      { key: 'expiration_date', label: 'Expiration Date' },
      { key: 'premium', label: 'Premium', format: 'currency' },
    ],

    questions: [
      {
        id: 'pcybRevenueChange',
        title: 'My business revenue has significantly changed',
        description: 'Revenue is a primary rating factor for cyber policies.',
        group: 'prisk',
      },
      {
        id: 'pcybNewSystems',
        title: 'We have adopted new technology systems or vendors',
        description: 'New SaaS tools, cloud migrations, or third-party processors may affect coverage.',
        group: 'prisk',
      },
      {
        id: 'pcybProassuranceMedMal',
        title: 'I recently switched my primary medical malpractice policy to ProAssurance',
        description: 'Insureds with a ProAssurance Med Mal policy may qualify for ProSecure Cyber Coverage, we will check if you qualify at renewal.',
        group: 'prisk',
      },
    ],

    questionGroups: [
      { id: 'prisk', label: 'Risk Profile Changes' },
    ],

    endorsements: [],
    notices:      [],
  },
  NBND: {
    code: 'NBND',
    label: 'Notary Bond',
    icon: 'draw',
    pdfTemplate: 'NBND',

    fields: [
      { key: 'bond_number', label: 'Bond Number' },
      { key: 'effective_date', label: 'Effective Date' },
      { key: 'expiration_date', label: 'Expiration Date' },
      { key: 'premium', label: 'Premium', format: 'currency' },
      { key: 'carrier', label: 'Issuing Company' },
      { key: 'premium_payable', label: 'Carrier' },
    ],

    questions: [
      {
        id: 'legalName',
        title: 'My legal name has changed',
        description: 'I have recently changed my legal name and need to update my bond.',
        group: 'general',
      },
      {
        id: 'training',
        title: 'I have completed the required training by the state',
        description: 'Effective September 1, 2023 the state of Alabama began requiring notary publics to complete a mandatory training course prior to renewing their bond.',
        group: 'general',
      },
    ],

    questionGroups: [
      { id: 'general', label: 'Profile Changes' },
    ],

    endorsements: [],
    notices:      [],
  },
}

module.exports = policyTypes