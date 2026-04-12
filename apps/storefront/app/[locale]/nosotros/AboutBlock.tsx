import styles from './Nosotros.module.css';
import { ScrollReveal } from '@/components/ScrollReveal';

interface AboutBlockProps {
    title: string;
    text: string;
    image: string;
    reverse?: boolean;
}

export const AboutBlock = ({ title, text, image, reverse = false }: AboutBlockProps) => {
    return (
        <ScrollReveal direction={reverse ? "right" : "left"} delay={200}>
            <div className={`${styles.block} ${reverse ? styles.reverse : ''}`}>
                <div className={styles.blockImage}>
                    <img src={image} alt={title} loading="lazy" />
                </div>
                <div className={styles.blockContent}>
                    <h3 className="text-serif">{title}</h3>
                    <p className="text-sans">{text}</p>
                </div>
            </div>
        </ScrollReveal>
    );
};