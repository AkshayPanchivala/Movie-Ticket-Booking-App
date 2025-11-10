import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = 'Pick a date',
  disabled = false,
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateTimePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showTime?: boolean;
}

export function DateTimePicker({
  date,
  onDateChange,
  placeholder = 'Pick a date and time',
  disabled = false,
  className,
  showTime = false,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  const [timeValue, setTimeValue] = React.useState<string>(
    date ? format(date, 'HH:mm') : '00:00'
  );

  React.useEffect(() => {
    setSelectedDate(date);
    if (date) {
      setTimeValue(format(date, 'HH:mm'));
    }
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // If we have a time value, apply it to the new date
      if (showTime && timeValue) {
        const [hours, minutes] = timeValue.split(':');
        newDate.setHours(parseInt(hours), parseInt(minutes));
      }
      setSelectedDate(newDate);
      onDateChange(newDate);
    } else {
      setSelectedDate(undefined);
      onDateChange(undefined);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);

    if (selectedDate) {
      const [hours, minutes] = newTime.split(':');
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      onDateChange(newDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            showTime ? (
              format(selectedDate, 'PPP HH:mm')
            ) : (
              format(selectedDate, 'PPP')
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
          {showTime && (
            <div className="border-t pt-3">
              <label className="text-sm font-medium mb-2 block">Time</label>
              <input
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
