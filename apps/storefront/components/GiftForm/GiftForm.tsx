"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { X } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import styles from "./GiftForm.module.css";

type Product = {
  id: number;
  name: Record<string, string>;
  price: number;
  image_url: string | null;
  available: boolean;
  buyable: boolean;
};

type GiftFormProps = {
  products: Product[];
  locale: string;
};

export default function GiftForm({ products, locale }: GiftFormProps) {
  const t = useTranslations("GiftPage");
  const localeHook = useLocale();
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const checkExisting = (productId: number) => cartItems.find((item) => item.id === productId && item.is_gift);

  const [formData, setFormData] = useState({
    selectedExperience: "",
    quantity: "1",
    voucherValue: "",
    notifyRecipient: false,
    recipientName: "",
    recipientEmail: "",
    recipientMessage: "",
    acceptTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  // Get selected experience data
  const selectedExperience = products.find(
    (p) => p.id.toString() === formData.selectedExperience,
  );

  // Calculate total value
  const voucherValue = parseInt(formData.voucherValue) || 0;
  const quantity = parseInt(formData.quantity) || 1;
  const experienceCost = selectedExperience
    ? selectedExperience.price * quantity
    : 0;
  const totalValue = experienceCost + voucherValue;

  // Generate voucher values (multiples of 10 from 10 to 200)
  const voucherValues = Array.from({ length: 20 }, (_, i) => (i + 1) * 10);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms || !selectedExperience) return;
    setIsSubmitting(true);

    try {
      const qty = parseInt(formData.quantity) || 1;
      const voucher = parseInt(formData.voucherValue) || 0;
      addItem({
        id: selectedExperience.id + 10000,
        name: {
          ...selectedExperience.name,
          [locale]: `🎁 ${selectedExperience.name[locale]}${formData.recipientName ? ` para ${formData.recipientName}` : ''}`,
        },
        price: totalValue,
        image_url: selectedExperience.image_url,
        quantity: qty,
        is_gift: true,
        recipient_name: formData.recipientName || undefined,
        recipient_email: formData.recipientEmail || undefined,
        recipient_message: formData.recipientMessage || undefined,
        voucher_value: voucher || undefined,
      });

      window.location.href = `/${localeHook}/checkout`;
    } catch (_error) {
      setSubmitMessage(t("giftError"));
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.selectedExperience &&
    (!formData.notifyRecipient ||
      (formData.recipientName && formData.recipientEmail)) &&
    formData.acceptTerms;

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.giftForm}>
        <div className={styles.formGroup}>
          <label htmlFor="selectedExperience" className={styles.label}>
            {t("selectExperience")}
          </label>
          <select
            id="selectedExperience"
            name="selectedExperience"
            value={formData.selectedExperience}
            onChange={handleInputChange}
            className={styles.select}
            required
          >
            <option value="">{t("selectExperience")}</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name[locale]}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Description */}
        {selectedExperience && (
          <div className={styles.experienceInfo}>
            <div className={styles.experienceHeader}>
              <h4 className={styles.experienceTitle}>
                {selectedExperience.name[locale]}
              </h4>
              <div className={styles.experienceBadge}>
                Experiencia Disponible
              </div>
            </div>
            <div className={styles.experienceDetails}>
              <p className={styles.experiencePrice}>
                Precio por persona: ${selectedExperience.price}
              </p>
              <p className={styles.experienceDescription}>
                <strong>Experiencia principal:</strong> Incluye acceso completo
                a las instalaciones de Antíca Café, degustación de cafés premium
                y una sesión guiada por nuestros expertos baristas.
              </p>
            </div>
          </div>
        )}

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="quantity" className={styles.label}>
              {t("quantity")}
            </label>
            <select
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className={styles.select}
              required
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <small className={styles.helpText}>{t("quantityHelp")}</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="voucherValue" className={styles.label}>
              {t("voucherValue")}
            </label>
            <select
              id="voucherValue"
              name="voucherValue"
              value={formData.voucherValue}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="">{t("voucherPlaceholder")}</option>
              {voucherValues.map((value) => (
                <option key={value} value={value}>
                  ${value}
                </option>
              ))}
            </select>
            <div className={styles.voucherExplanation}>
              <small className={styles.explanationText}>
                {t("voucherExplanation")}
              </small>
            </div>
          </div>
        </div>

        {/* Total Value Display */}
        {selectedExperience && (
          <div className={styles.totalBreakdown}>
            <div className={styles.costRow}>
              <span className={styles.costLabel}>
                Experiencia ({quantity}{" "}
                {quantity === 1 ? "persona" : "personas"}):
              </span>
              <span className={styles.costAmount}>${experienceCost}</span>
            </div>
            {voucherValue > 0 && (
              <div className={styles.costRow}>
                <span className={styles.costLabel}>Voucher Extra:</span>
                <span className={styles.costAmount}>${voucherValue}</span>
              </div>
            )}
            <div className={`${styles.costRow} ${styles.totalRow}`}>
              <span className={styles.totalLabel}>{t("totalValue")}:</span>
              <span className={styles.totalAmount}>${totalValue}</span>
            </div>
          </div>
        )}

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="notifyRecipient"
              checked={formData.notifyRecipient}
              onChange={handleInputChange}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>{t("notifyRecipient")}</span>
          </label>
        </div>

        {formData.notifyRecipient && (
          <>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="recipientName" className={styles.label}>
                  {t("recipientName")}
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  className={styles.input}
                  required={formData.notifyRecipient}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="recipientEmail" className={styles.label}>
                  {t("recipientEmail")}
                </label>
                <input
                  type="email"
                  id="recipientEmail"
                  name="recipientEmail"
                  value={formData.recipientEmail}
                  onChange={handleInputChange}
                  className={styles.input}
                  required={formData.notifyRecipient}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="recipientMessage" className={styles.label}>
                {t("recipientMessage")}
              </label>
              <textarea
                id="recipientMessage"
                name="recipientMessage"
                value={formData.recipientMessage}
                onChange={handleInputChange}
                placeholder={t("recipientMessagePlaceholder")}
                className={styles.textarea}
                rows={3}
              />
            </div>
          </>
        )}

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              className={styles.checkbox}
              required
            />
            <span className={styles.checkboxText}>
              {t("termsAndConditions")}{" "}
              <button
                type="button"
                className={styles.termsLink}
                onClick={() => setShowTerms(true)}
              >
                ({t("termsLink")})
              </button>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`${styles.submitButton} ${isFormValid ? styles.submitButtonActive : ""}`}
        >
          {isSubmitting ? "Enviando..." : t("sendGift")}
        </button>

        {submitMessage && (
          <div
            className={`${styles.message} ${submitMessage === t("giftSent") ? styles.messageSuccess : styles.messageError}`}
          >
            {submitMessage}
          </div>
        )}
      </form>

      {showTerms && (
        <div className={styles.overlay}>
          <div className={styles.overlayBg} onClick={() => setShowTerms(false)} />
          <div className={styles.modal}>
            <button
              onClick={() => setShowTerms(false)}
              className={styles.modalClose}
            >
              <X size={20} />
            </button>
            <h3 className={styles.modalTitle}>Términos y Condiciones</h3>
            <div className={styles.modalBody}>
              <p>1. Los vouchers son válidos por 1 año desde la fecha de emisión.</p>
              <p>2. Los vouchers no son reembolsables ni transferibles.</p>
              <p>3. El beneficiado debe presentar identificación válida.</p>
              <p>4. Antíca se reserva el derecho de modificar las experiencias.</p>
              <p>5. Para más información contactar a info@antica.com.</p>
            </div>
            <button
              onClick={() => setShowTerms(false)}
              className={styles.modalButton}
              style={{ backgroundColor: '#cba87c' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
