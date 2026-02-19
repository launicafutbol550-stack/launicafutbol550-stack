import complejo from '../../imagendelcomplejo.jpg';
import { DEFAULT_DAYS } from '../constants';
import { formatLongDate } from '../utils/date';

function BookingPage({
  user,
  selectedDate,
  upcomingDates,
  holidays,
  slotsByCourt,
  bookingsByCourtHour,
  onChangeDate,
  onBookSlot,
  onGoLogin,
  onGoRegister,
  bookingInProgress
}) {
  const selectedDateIndex = upcomingDates.indexOf(selectedDate);
  const canGoPrev = selectedDateIndex > 0;
  const canGoNext = selectedDateIndex < upcomingDates.length - 1;
  const isHoliday = holidays.includes(selectedDate);
  const dayIndex = new Date(`${selectedDate}T00:00:00`).getDay();

  return (
    <section className="card landing-card">
      <img src={complejo} alt="Complejo La Única" className="banner" />

      <details className="booking-info" open>
        <summary>ℹ️ Información importante del turno</summary>
        <div className="booking-info-content">
          <p>
            <strong>Valor del turno:</strong> $58.800 (fijo).
          </p>
          <p>
            Se divide entre todos los jugadores: 7 vs 7 = $4200 por persona, 6 vs 6 = $4900 por persona y así
            sucesivamente.
          </p>
          <p>
            Reservas únicamente por WhatsApp. El mismo día del turno (10:00 a 12:00 hs) enviamos mensaje de
            confirmación.
          </p>
          <p>
            El turno queda a nombre de una persona responsable que confirma, abona el total y entrega las pecheras al
            finalizar.
          </p>
          <p>
            <strong>Pagos:</strong> efectivo (todos le pagan a una sola persona) o transferencia (todos a una misma cuenta,
            que es la única que transfiere a La Única Quequén). No se reciben pagos individuales.
          </p>
        </div>
      </details>

      <div className="landing-topbar">
        <div>
          <h2>Disponibilidad por cancha</h2>
          <p className="date-title">{formatLongDate(selectedDate)}</p>
        </div>
        {!user && (
          <div className="landing-actions">
            <button type="button" className="btn-secondary" onClick={onGoLogin}>
              Iniciar sesión
            </button>
            <button type="button" onClick={onGoRegister}>
              Registrarse
            </button>
          </div>
        )}
      </div>

      <div className="week-nav">
        <button type="button" className="btn-secondary" onClick={() => onChangeDate(upcomingDates[selectedDateIndex - 1])} disabled={!canGoPrev}>
          ← Día anterior
        </button>
        <div className="week-chips" role="tablist" aria-label="Próximos siete días">
          {upcomingDates.map((date) => (
            <button
              key={date}
              type="button"
              role="tab"
              aria-selected={date === selectedDate}
              className={date === selectedDate ? 'day-chip day-chip-active' : 'day-chip'}
              onClick={() => onChangeDate(date)}
            >
              {DEFAULT_DAYS[new Date(`${date}T00:00:00`).getDay()]} {date.slice(8)}
            </button>
          ))}
        </div>
        <button type="button" className="btn-secondary" onClick={() => onChangeDate(upcomingDates[selectedDateIndex + 1])} disabled={!canGoNext}>
          Día siguiente →
        </button>
      </div>

      {isHoliday && <p className="holiday-alert">Este día es feriado. No hay turnos disponibles.</p>}

      {!isHoliday &&
        slotsByCourt.map((court) => (
          <article key={court.id} className="court-block">
            <h3>{court.name}</h3>
            <div className="slot-grid">
              {court.hours.length === 0 && <p>Sin horarios configurados para {DEFAULT_DAYS[dayIndex]}.</p>}
              {court.hours.map((hour) => {
                const slotKey = `${court.id}-${hour}`;
                const booked = bookingsByCourtHour[slotKey];
                return (
                  <button
                    key={slotKey}
                    type="button"
                    disabled={Boolean(booked) || bookingInProgress}
                    className={booked ? 'slot slot-booked' : 'slot slot-open'}
                    onClick={() => onBookSlot(court.id, hour)}
                  >
                    {hour}:00 {booked ? '· Reservado' : '· Disponible'}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
    </section>
  );
}

export default BookingPage;
