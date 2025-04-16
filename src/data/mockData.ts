
import { Control, Client, Audit } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock client
export const mockClient: Client = {
  id: uuidv4(),
  name: 'Acme Corporation',
  logoUrl: 'https://via.placeholder.com/150x150?text=ACME',
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock security controls
export const mockControls: Control[] = [
  {
    id: uuidv4(),
    category: 'Access Control',
    title: 'AC-1: Account Management',
    description: 'The organization manages information system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts.',
    status: 'compliant',
    comment: '',
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    category: 'Access Control',
    title: 'AC-2: Access Enforcement',
    description: 'The information system enforces approved authorizations for logical access to the system in accordance with applicable policy.',
    status: 'notCompliant',
    comment: '',
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    category: 'Risk Assessment',
    title: 'RA-1: Risk Assessment Policy and Procedures',
    description: 'The organization develops, disseminates, and reviews/updates a risk assessment policy and procedures.',
    status: 'partial',
    comment: '',
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    category: 'Risk Assessment',
    title: 'RA-2: Security Categorization',
    description: 'The organization categorizes information and information systems in accordance with applicable laws, regulations, standards, and guidance.',
    status: 'notApplicable',
    comment: '',
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    category: 'System and Communications Protection',
    title: 'SC-1: System and Communications Protection Policy and Procedures',
    description: 'The organization develops, disseminates, and reviews/updates a system and communications protection policy and procedures.',
    status: 'compliant',
    comment: '',
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    category: 'Configuration Management',
    title: 'CM-1: Configuration Management Policy and Procedures',
    description: 'The organization develops, disseminates, and reviews/updates configuration management policy and procedures.',
    status: 'partial',
    comment: '',
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    category: 'Incident Response',
    title: 'IR-1: Incident Response Policy and Procedures',
    description: 'The organization develops, disseminates, and reviews/updates an incident response policy and procedures.',
    status: 'compliant',
    comment: '',
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    category: 'Incident Response',
    title: 'IR-2: Incident Response Training',
    description: 'The organization trains personnel in their incident response roles and responsibilities with respect to the information system.',
    status: 'notCompliant',
    comment: '',
    updatedAt: new Date()
  },
];

// Mock audit
export const mockAudit: Audit = {
  id: uuidv4(),
  client: mockClient,
  controls: mockControls,
  createdAt: new Date(),
  updatedAt: new Date(),
  submitted: false
};
