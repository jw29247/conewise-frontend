import React from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '../ui/Button';
import { CalendarIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

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
      <h2 className="text-2xl font-light text-gray-900 mb-6">Work Details</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Work Description */}
        <div>
          <label htmlFor="workDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Work Description *
          </label>
          <div className="relative">
            <DocumentTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              id="workDescription"
              {...register('workDescription', { required: 'Work description is required' })}
              rows={4}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe the work being carried out (e.g., Gas main repair, Cable installation, Road resurfacing)"
            />
          </div>
          {errors.workDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.workDescription.message}</p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <DatePicker
                selected={startDate ? new Date(startDate) : null}
                onChange={(date) => setValue('startDate', date ? date.toISOString().split('T')[0] : '')}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholderText="Select start date"
                required
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <DatePicker
                selected={endDate ? new Date(endDate) : null}
                onChange={(date) => setValue('endDate', date ? date.toISOString().split('T')[0] : '')}
                dateFormat="dd/MM/yyyy"
                minDate={startDate ? new Date(startDate) : new Date()}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholderText="Select end date"
                required
              />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Work Hours */}
        <div>
          <label htmlFor="workHours" className="block text-sm font-medium text-gray-700 mb-2">
            Work Hours *
          </label>
          <div className="relative">
            <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="workHours"
              type="text"
              {...register('workHours', { required: 'Work hours are required' })}
              placeholder="e.g., 9:00 AM - 5:00 PM"
              disabled={require24HourAccess}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {errors.workHours && (
            <p className="mt-1 text-sm text-red-600">{errors.workHours.message}</p>
          )}
        </div>

        {/* 24 Hour Access */}
        <div className="bg-gray-50 rounded-xl p-4">
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
              className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="require24HourAccess" className="ml-3 block text-sm font-medium text-gray-700">
              Requires 24-hour access
            </label>
          </div>
        </div>

        {/* Additional Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Requirements
          </label>
          <textarea
            id="requirements"
            {...register('requirements')}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
            placeholder="Any special requirements or considerations (e.g., Emergency access required, Heavy vehicles, Night work)"
          />
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong className="font-medium">Note:</strong> Please ensure all information is accurate as it will be used to generate your traffic management plan in compliance with UK regulations.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" variant="brand" size="lg" className="w-full">
            Continue to Review
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WorkDetailsForm;