import React, { useState } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import Button from '../components/ui/Button';
import MapDrawing from '../components/Plan/MapDrawing';
import AddressSearch from '../components/Plan/AddressSearch';
import WorkDetailsForm from '../components/Plan/WorkDetailsForm';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface Equipment {
  id: string;
  type: string;
  name: string;
  icon: string;
  color: string;
  width: number;
  length: number;
  coordinates: [number, number];
  rotation: number;
}

interface PlanFormData {
  address: string;
  coordinates: { lat: number; lng: number } | null;
  workArea: GeoJSON.Feature | null;
  equipment: Equipment[];
  workDescription: string;
  requirements: string;
  workHours: string;
  startDate: string;
  endDate: string;
  require24HourAccess: boolean;
}

const STEPS = [
  { id: 1, name: 'Location', description: 'Search for the work location' },
  { id: 2, name: 'Work Area', description: 'Draw the work area and place equipment' },
  { id: 3, name: 'Details', description: 'Provide work details and schedule' },
  { id: 4, name: 'Review', description: 'Review and generate plan' },
];

const GeneratePlanPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PlanFormData>({
    address: '',
    coordinates: null,
    workArea: null,
    equipment: [],
    workDescription: '',
    requirements: '',
    workHours: '',
    startDate: '',
    endDate: '',
    require24HourAccess: false,
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddressSelect = (address: string, coordinates: { lat: number; lng: number }) => {
    setFormData({ ...formData, address, coordinates });
    handleNext();
  };

  const handleMapDataUpdate = (workArea: GeoJSON.Feature | null, equipment: Equipment[]) => {
    setFormData({ ...formData, workArea, equipment });
  };

  const handleDetailsSubmit = (details: Partial<PlanFormData>) => {
    setFormData({ ...formData, ...details });
    handleNext();
  };

  const handleGeneratePlan = async () => {
    try {
      // TODO: Call API to generate plan
      console.log('Generating plan with data:', formData);
      // navigate('/plans');
    } catch (error) {
      console.error('Error generating plan:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressSearch
            onAddressSelect={handleAddressSelect}
            initialAddress={formData.address}
          />
        );
      case 2:
        return (
          <MapDrawing
            center={formData.coordinates || { lat: 51.5074, lng: -0.1278 }}
            onDataUpdate={handleMapDataUpdate}
            initialWorkArea={formData.workArea}
            initialEquipment={formData.equipment}
          />
        );
      case 3:
        return (
          <WorkDetailsForm
            onSubmit={handleDetailsSubmit}
            initialData={{
              workDescription: formData.workDescription,
              requirements: formData.requirements,
              workHours: formData.workHours,
              startDate: formData.startDate,
              endDate: formData.endDate,
              require24HourAccess: formData.require24HourAccess,
            }}
          />
        );
      case 4:
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-2xl font-light text-gray-900 mb-6">Review Your Plan</h3>
            <dl className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <dt className="text-sm font-medium text-gray-500 mb-1">Location</dt>
                <dd className="text-gray-900">{formData.address}</dd>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <dt className="text-sm font-medium text-gray-500 mb-1">Work Description</dt>
                <dd className="text-gray-900">{formData.workDescription}</dd>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <dt className="text-sm font-medium text-gray-500 mb-1">Work Hours</dt>
                <dd className="text-gray-900">
                  {formData.workHours}
                  {formData.require24HourAccess && ' (24-hour access required)'}
                </dd>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <dt className="text-sm font-medium text-gray-500 mb-1">Duration</dt>
                <dd className="text-gray-900">
                  {formData.startDate} to {formData.endDate}
                </dd>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <dt className="text-sm font-medium text-gray-500 mb-1">Equipment</dt>
                <dd className="text-gray-900">
                  {formData.equipment.length} items placed on map
                </dd>
              </div>
              {formData.requirements && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <dt className="text-sm font-medium text-gray-500 mb-1">Additional Requirements</dt>
                  <dd className="text-gray-900">{formData.requirements}</dd>
                </div>
              )}
            </dl>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout 
      title="Generate Traffic Management Plan"
      subtitle="Create a new traffic management plan for your work site"
    >
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-4xl font-extralight text-gray-900 mb-4">Create New Plan</h2>
                <p className="text-lg text-gray-600">
                  Follow the steps below to generate your traffic management plan.
                </p>
              </div>

          {/* Progress Steps */}
          <nav aria-label="Progress" className="mb-8">
            <ol className="flex items-center justify-between">
              {STEPS.map((step, stepIdx) => (
                <li
                  key={step.name}
                  className="relative flex-1 flex items-center"
                >
                  <div className="flex items-center relative w-full">
                    {/* Progress Line - Behind the circles */}
                    {stepIdx !== STEPS.length - 1 && (
                      <div className="absolute left-0 right-0 top-5 flex items-center" style={{ marginLeft: '20px', marginRight: '-100%' }}>
                        <div className="flex-1 relative">
                          <div className="absolute inset-0 h-0.5 bg-gray-200"></div>
                          <div 
                            className={`absolute inset-0 h-0.5 transition-all duration-500 ${
                              step.id < currentStep ? 'bg-green-500' : ''
                            }`}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Step Circle and Content */}
                    <div className="relative flex items-center">
                      <div
                        className={`
                          relative flex h-10 w-10 items-center justify-center rounded-full z-10
                          transition-all duration-300
                          ${step.id < currentStep
                            ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30'
                            : step.id === currentStep
                            ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30'
                            : 'bg-gray-200'
                          }
                        `}
                      >
                        <span className={`font-medium ${step.id <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                          {step.id}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p
                          className={`
                            text-sm font-medium transition-colors duration-300 whitespace-nowrap
                            ${step.id <= currentStep ? 'text-gray-900' : 'text-gray-400'}
                          `}
                        >
                          {step.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          {/* Step Content */}
          <div className="mb-8 transition-all duration-300">
            {renderStepContent()}
          </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  size="lg"
                  className="flex items-center"
                >
                  <ChevronLeftIcon className="h-5 w-5 mr-2" />
                  Previous
                </Button>

                {currentStep === STEPS.length ? (
                  <Button
                    type="button"
                    variant="brand"
                    onClick={handleGeneratePlan}
                    size="lg"
                    className="flex items-center"
                  >
                    Generate Plan
                    <ChevronRightIcon className="h-5 w-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="brand"
                    onClick={handleNext}
                    size="lg"
                    className="flex items-center"
                    disabled={
                      (currentStep === 1 && !formData.coordinates) ||
                      (currentStep === 2 && !formData.workArea)
                    }
                  >
                    Next
                    <ChevronRightIcon className="h-5 w-5 ml-2" />
                  </Button>
                )}
              </div>
            </div>
      </main>
    </AppLayout>
  );
};

export default GeneratePlanPage;