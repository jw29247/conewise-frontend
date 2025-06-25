import React from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface WorkDetailsFormProps {
  onSubmit: (data: WorkDetailsData) => void;
  initialData?: WorkDetailsData;
}

interface WorkDetailsData {
  workDescription: string;
  requirements: string;
  workHours: string;
  startDate: string;
  endDate: string;
  require24HourAccess: boolean;
}

const WorkDetailsForm: React.FC<WorkDetailsFormProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkDetailsData>({
    defaultValues: initialData || {
      workDescription: '',
      requirements: '',
      workHours: '9:00 AM - 5:00 PM',
      startDate: '',
      endDate: '',
      require24HourAccess: false,
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const require24HourAccess = watch('require24HourAccess');

  const handleFormSubmit = (data: WorkDetailsData) => {
    onSubmit(data);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-light text-gray-900">Work Details</h2>
          <p className="text-sm text-gray-500 mt-1">Provide information about the work to be carried out</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Work Description */}
        <div>
          <label htmlFor="workDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Work Description *
          </label>
          <textarea
            id="workDescription"
            {...register('workDescription', { required: 'Work description is required' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            placeholder="Describe the work being carried out (e.g., Gas main repair, Cable installation, Road resurfacing)"
          />
          {errors.workDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.workDescription.message}</p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <DatePicker
              selected={startDate ? new Date(startDate) : null}
              onChange={(date) => setValue('startDate', date ? date.toISOString().split('T')[0] : '')}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              placeholderText="Select start date"
              required
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <DatePicker
              selected={endDate ? new Date(endDate) : null}
              onChange={(date) => setValue('endDate', date ? date.toISOString().split('T')[0] : '')}
              dateFormat="dd/MM/yyyy"
              minDate={startDate ? new Date(startDate) : new Date()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              placeholderText="Select end date"
              required
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Work Hours */}
        <div>
          <label htmlFor="workHours" className="block text-sm font-medium text-gray-700 mb-1">
            Work Hours *
          </label>
          <Input
            id="workHours"
            {...register('workHours', { required: 'Work hours are required' })}
            placeholder="e.g., 9:00 AM - 5:00 PM"
            disabled={require24HourAccess}
          />
          {errors.workHours && (
            <p className="mt-1 text-sm text-red-600">{errors.workHours.message}</p>
          )}
        </div>

        {/* 24 Hour Access */}
        <div className="flex items-center">
          <input
            id="require24HourAccess"
            type="checkbox"
            {...register('require24HourAccess')}
            onChange={(e) => {
              setValue('require24HourAccess', e.target.checked);
              if (e.target.checked) {
                setValue('workHours', '24 hours');
              } else {
                setValue('workHours', '9:00 AM - 5:00 PM');
              }
            }}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label htmlFor="require24HourAccess" className="ml-2 block text-sm text-gray-700">
            Requires 24-hour access
          </label>
        </div>

        {/* Additional Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Requirements
          </label>
          <textarea
            id="requirements"
            {...register('requirements')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            placeholder="Any special requirements or considerations (e.g., Emergency access required, Heavy vehicles, Night work)"
          />
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-br from-amber-50 to-green-50 rounded-xl p-6 border border-amber-200">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-amber-800">Important</h4>
              <p className="mt-1 text-sm text-amber-700">
                Please ensure all information is accurate as it will be used to generate your traffic management plan in compliance with UK regulations.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" variant="brand" className="w-full">
            Continue to Review
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WorkDetailsForm;