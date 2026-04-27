"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";
import { useTranslations, useLocale } from "next-intl";
import { getSettings } from "@/lib/cms";
import styles from "../Checkout.module.css";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface CheckoutUIProps {
  heroImage: string;
}

export default function CheckoutUI({ heroImage }: CheckoutUIProps) {
  const [currency, setCurrency] = useState("COP");
  const { items, getTotalPrice, clearCart } = useCartStore();
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [orderEmail, setOrderEmail] = useState("");

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const curr = await getSettings("currency", "COP");
        setCurrency(curr);
        
        const testConfig = await getSettings("test_mode_enabled", { enabled: false });
        setTestMode(!!testConfig.enabled);
      } catch (e) {
        console.error("Error loading configs:", e);
      }
    };
    fetchConfigs();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setIsRedirecting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    setOrderEmail(email);

    const billingData = {
      name: formData.get("name") as string,
      email: email,
      docType: formData.get("docType") as string,
      docId: formData.get("docId") as string,
      address: formData.get("address") as string,
    };

    if (testMode) {
      toast.info("Modo Test: Conectando con la plataforma de pago...");
      
      try {
        const { error } = await supabase
          .from('orders')
          .insert({
            customer_name: billingData.name,
            customer_email: billingData.email,
            customer_address: billingData.address,
            customer_document_type: billingData.docType,
            customer_document_id: billingData.docId,
            total_amount: getTotalPrice(),
            items: items.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image_url: item.image_url
            })),
            status: 'pending'
          });

        if (error) {
          console.error("Supabase Error:", error);
          throw error;
        }

        await new Promise(resolve => setTimeout(resolve, 2500));
        
        setIsSuccess(true);
        setIsRedirecting(false);
        setLoading(false);
        clearCart();
        
        toast.success("¡Pago procesado con éxito!");
      } catch (error: any) {
        console.error("Error creating test order:", error);
        toast.error("Error al procesar el pedido: " + (error.message || "Error desconocido"));
        setIsRedirecting(false);
        setLoading(false);
      }
    } else {
      // Flujo Normal: Redirección simulada
      toast.loading("Conectando con la pasarela de pagos segura...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // En un flujo real, aquí redirigiríamos. Para esta demo, mostramos el éxito
      setIsSuccess(true);
      setIsRedirecting(false);
      setLoading(false);
      clearCart();
    }
  };

  // Vista de éxito (Gracias por su compra)
  if (isSuccess) {
    return (
      <div className={styles.wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="container-custom flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
           <div className="bg-secondary p-12 md:p-20 rounded-[3rem] border border-border-color shadow-2xl max-w-3xl w-full">
              <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-10 mx-auto">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h1 className="text-serif text-5xl md:text-6xl mb-6">¡Gracias por tu compra!</h1>
              <p className="text-xl md:text-2xl text-(--foreground)/60 mb-12 leading-relaxed">
                Tu pedido ha sido procesado correctamente. <br className="hidden md:block" />
                Hemos enviado la factura y los detalles de la compra al correo: <br/>
                <strong className="text-accent-gold block mt-2 font-bold">{orderEmail}</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                 <a href={`/${locale}`} className="btn btn-primary px-10 py-5 uppercase tracking-widest font-black text-[11px] w-full sm:w-auto">
                   Volver al Inicio
                 </a>
                 <a href={`/${locale}/productos`} className="btn btn-outline px-10 py-5 uppercase tracking-widest font-black text-[11px] w-full sm:w-auto">
                   Seguir Comprando
                 </a>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.wrapper}>
         <div className="p-20 text-center flex flex-col items-center gap-6">
            <h2 className="text-serif text-3xl">Tu carrito está vacío</h2>
            <p className="text-accent-gold font-bold uppercase tracking-widest text-[10px]">Agrega productos para continuar</p>
            <a href={`/${locale}/productos`} className="btn btn-primary px-8 py-3">Ver Productos</a>
         </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Loading Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center">
          <div className="w-16 h-16 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mb-8" />
          <h2 className="text-3xl font-normal mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            {testMode ? 'Simulando Pago' : 'Redirigiendo al Pago'}
          </h2>
          <p className="text-white/60 max-w-md">
            {testMode 
              ? 'Estamos conectando con la plataforma de pago simulada de Antíca. Por favor no cierres esta ventana.' 
              : 'Estamos conectando con nuestra pasarela segura para que completes tu transacción.'}
          </p>
        </div>
      )}

      <section
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('${heroImage}')`,
          height: "30vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={styles.heroContent}>
          <h1 className="text-serif text-5xl md:text-6xl text-white mb-2">{t("title")}</h1>
          <div className="h-1 w-12 bg-accent-gold mx-auto rounded-full" />
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Formulario Unificado */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.formSection}>
              <div className="flex items-center justify-between mb-8">
                <h2 className={styles.formTitle} style={{ marginBottom: 0 }}>
                  {t("billingDetails") || "Detalles de Facturación"}
                </h2>
                {testMode && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest border border-amber-500/20">
                    Modo Test Activo
                  </span>
                )}
              </div>

              <div className={styles.formSection}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>{t("name")}</label>
                  <input name="name" placeholder="Ej. Juan Pérez" className={styles.input} required />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>{t("email")}</label>
                  <input name="email" type="email" placeholder="juan@ejemplo.com" className={styles.input} required />
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Tipo de Documento</label>
                    <select name="docType" className={styles.select} required>
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="NIT">NIT</option>
                      <option value="CE">Cédula de Extranjería</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>{t("documentId")}</label>
                    <input name="docId" placeholder="Número de documento" className={styles.input} required />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>{t("address")}</label>
                  <input name="address" placeholder="Dirección completa" className={styles.input} required />
                </div>

                <button type="submit" className={styles.payButton} disabled={loading}>
                  {loading ? 'Procesando...' : (testMode ? 'Simular Pago y Finalizar' : 'Ir al Pago Seguro')}
                </button>
              </div>
            </form>
          </div>

          {/* Resumen Lateral */}
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>{t("orderSummary")}</h2>
            
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <img 
                    src={item.image_url || "/media/placeholder.png"} 
                    alt={item.name[locale]} 
                    className={styles.itemImage}
                  />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name[locale]}</span>
                    <div className="flex items-center gap-2">
                       <span className={styles.itemPrice}>$ {item.price} {currency}</span>
                       <span className={styles.itemQty}>x {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.subtotalRow}>
                <span>Subtotal</span>
                <span>$ {getTotalPrice()} {currency}</span>
              </div>
              <div className={styles.subtotalRow}>
                <span>Envío</span>
                <span className="text-green-500 font-bold uppercase text-[9px]">Gratis</span>
              </div>
              <div className={styles.totalRow}>
                <span>{t("total")}</span>
                <span>
                  $ {getTotalPrice()} {currency}
                </span>
              </div>
            </div>

            <div className={styles.secureBadge}>
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
               {testMode ? 'Entorno de Pruebas Antíca' : 'Pago 100% Seguro'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
