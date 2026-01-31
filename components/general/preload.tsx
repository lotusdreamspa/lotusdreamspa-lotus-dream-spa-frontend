"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {LiquidEtherElement} from "@/components" // Assicurati che il percorso sia corretto

// Definizione dell'animazione: solo Opacity
const opacityAnim = {
    initial: { opacity: 1 },
    exit: { 
        opacity: 0, 
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
    }
};

export default function PreLoad() {
    const [dimension, setDimension] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimension({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    return (
        <motion.div
            variants={opacityAnim}
            initial="initial"
            exit="exit"
            // z-50 per stare sopra tutto, fixed per bloccarlo, bg-black o il tuo colore di sfondo
            className="fixed top-0 left-0 w-screen h-screen z-50 bg-black cursor-wait"
        >
            {dimension.width > 0 && (
                <div className="w-full h-full relative">
                    {/* Componente LiquidEther a tutto schermo */}
                    <LiquidEtherElement
                        colors={['#5227FF', '#FF9FFC', '#B19EEF']} // I tuoi colori
                        mouseForce={20}
                        cursorSize={100}
                        isViscous={true}
                        viscous={30}
                        resolution={0.5}
                        // Attiviamo l'autoDemo per avere movimento senza che l'utente debba muovere il mouse
                        autoDemo={true} 
                        autoSpeed={0.5}
                        autoIntensity={2.2}
                        // Stile per forzare il riempimento
                        style={{ width: '100%', height: '100%' }}
                    />
                    
                    {/* Se vuoi sovrapporre il logo o un testo al centro del liquido, puoi farlo qui: */}
                    {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <h1 className="text-white text-4xl mix-blend-difference">LOADING...</h1> 
                    </div> 
                    */}
                </div>
            )}
        </motion.div>
    );
}