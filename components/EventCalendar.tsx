
import React, { useState } from 'react';
import { AgendaEvent, Category } from '../types';

interface EventCalendarProps {
  events: AgendaEvent[];
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 = Sunday

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  // Adjust for Monday start (0=Monday, 6=Sunday)
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

  const prevMonth = () => {
      setCurrentDate(new Date(year, month - 1, 1));
      setSelectedDate(null);
  };
  const nextMonth = () => {
      setCurrentDate(new Date(year, month + 1, 1));
      setSelectedDate(null);
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const getEventsForDay = (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return events.filter(e => e.date === dateStr);
  };

  const selectedDateEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
        case Category.Salud: return 'bg-red-500';
        case Category.Deporte: return 'bg-blue-500';
        case Category.Naturaleza: return 'bg-emerald-500';
        case Category.Cultura: return 'bg-purple-600';
        case Category.Sostenibilidad: return 'bg-amber-500';
        default: return 'bg-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-gray-900 capitalize">
            {monthNames[month]} <span className="text-gray-400 font-light">{year}</span>
        </h3>
        <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
            <div key={d} className="text-xs font-bold text-gray-400 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 auto-rows-fr">
        {emptyDays.map(i => <div key={`empty-${i}`} className="p-2"></div>)}
        
        {days.map(day => {
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
            const isSelected = selectedDate === day;

            return (
                <button 
                    key={day} 
                    onClick={() => setSelectedDate(day)}
                    className={`relative p-2 rounded-xl flex flex-col items-center justify-start min-h-[60px] border border-transparent transition-all group
                        ${isSelected ? 'bg-gray-900 text-white shadow-lg' : 'hover:bg-gray-50 hover:border-gray-200'}
                        ${isToday && !isSelected ? 'bg-emerald-50 border-emerald-100' : ''}
                    `}
                >
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 
                        ${isToday && !isSelected ? 'bg-emerald-600 text-white shadow-md' : ''}
                        ${isSelected ? 'text-white' : 'text-gray-700'}
                    `}>{day}</span>
                    
                    <div className="flex gap-1 flex-wrap justify-center max-w-full px-1">
                        {dayEvents.map(ev => (
                            <div 
                                key={ev.id} 
                                className={`w-2 h-2 rounded-full ${getCategoryColor(ev.category)} ${isSelected ? 'border border-gray-800' : ''}`} 
                                title={`${ev.title} (${ev.startTime})`}
                            ></div>
                        ))}
                    </div>
                </button>
            );
        })}
      </div>
      
      {/* Selected Day Details */}
      <div className="mt-6 flex-1 border-t border-gray-100 pt-4 overflow-y-auto max-h-[200px] lg:max-h-none">
         <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
             {selectedDate ? `Actividades del día ${selectedDate}` : 'Selecciona un día'}
         </h4>
         <div className="space-y-3">
             {selectedDateEvents.length > 0 ? (
                 selectedDateEvents.map(ev => (
                     <div key={ev.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-default">
                         <div className={`w-1 h-full min-h-[30px] rounded-full ${getCategoryColor(ev.category)}`}></div>
                         <div>
                             <p className="font-bold text-sm text-gray-900">{ev.title}</p>
                             <p className="text-xs text-gray-500">{ev.startTime} - {ev.location}</p>
                         </div>
                     </div>
                 ))
             ) : (
                 <p className="text-sm text-gray-400 italic">No hay actividades programadas.</p>
             )}
         </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-gray-500 justify-center border-t border-gray-100 pt-4">
         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Salud</div>
         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Deporte</div>
         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Naturaleza</div>
         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-600"></div> Cultura</div>
         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Sostenibilidad</div>
      </div>
    </div>
  );
};

export default EventCalendar;
