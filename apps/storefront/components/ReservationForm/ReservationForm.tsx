"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './ReservationForm.module.css';

// CAMBIO 1: El tipo FormState ya no incluye 'null'. La acción SIEMPRE devuelve un objeto.
type FormState = {
    success: boolean;
    message: string;
};

// El estado del componente SÍ puede ser 'null' al inicio.
type ComponentState = FormState | null;

// CAMBIO 2: La firma de la función ahora promete devolver SIEMPRE un FormState.
async function submitReservation(prevState: ComponentState, formData: FormData): Promise<FormState> {
    const { supabase } = await import('@/lib/supabaseClient');

    const rawFormData = {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        date: formData.get('date') as string,
        time: formData.get('time') as string,
        guests: formData.get('guests') as string,
    };

    if (!rawFormData.name || !rawFormData.date || !rawFormData.time || !rawFormData.guests) {
        // Usamos el mensaje del diccionario para consistencia.
        return { success: false, message: 'Por favor completa todos los campos requeridos.' };
    }

    const { error } = await supabase.from('reservations').insert({
        name: rawFormData.name,
        phone: rawFormData.phone,
        reservation_date: rawFormData.date,
        reservation_time: rawFormData.time,
        number_of_guests: parseInt(rawFormData.guests, 10),
    });

    if (error) {
        console.error('Supabase error:', error);
        return { success: false, message: 'Hubo un error al guardar tu reserva.' };
    }

    return { success: true, message: '¡Reserva enviada con éxito!' };
}

const ReservationForm = () => {
    const t = useTranslations('ReservationForm');
    // El estado del componente usa el nuevo tipo 'ComponentState'
    const [formState, setFormState] = useState<ComponentState>(null);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // CAMBIO 3: Guardamos la referencia al formulario ANTES del await.
        const form = event.currentTarget;
        const formData = new FormData(form);

        const result = await submitReservation(formState, formData);
        setFormState(result);

        if (result.success) {
            // Usamos la referencia guardada para hacer el reset. ¡Esto ya no será null!
            form.reset();
        }
    };

    return (
        <section id="reservation" className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>{t('title')}</h2>
                <p className={styles.subtitle}>{t('subtitle')}</p>

                <form onSubmit={handleFormSubmit} className={styles.form}>
                    {/* ... el resto del formulario se mantiene igual ... */}
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>{t('nameLabel')}</label>
                        <input type="text" id="name" name="name" className={styles.input} placeholder={t('namePlaceholder')} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.label}>{t('phoneLabel')}</label>
                        <input type="tel" id="phone" name="phone" className={styles.input} placeholder={t('phonePlaceholder')} />
                    </div>

                    <div className={styles.dateTimeContainer}>
                        <div className={styles.formGroup}>
                            <label htmlFor="date" className={styles.label}>{t('dateLabel')}</label>
                            <input type="date" id="date" name="date" className={styles.input} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="time" className={styles.label}>{t('timeLabel')}</label>
                            <input type="time" id="time" name="time" className={styles.input} required />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="guests" className={styles.label}>{t('guestsLabel')}</label>
                        <input type="number" id="guests" name="guests" min="1" className={styles.input} placeholder={t('guestsPlaceholder')} required />
                    </div>

                    <button type="submit" className={`${styles.submitButton} btn btn-primary`}>
                        {t('submitButton')}
                    </button>
                </form>

                {formState && (
                    <div className={`${styles.message} ${formState.success ? styles.success : styles.error}`}>
                        {formState.success ? t('successMessage') : t('errorMessage')}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ReservationForm;