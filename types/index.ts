import { MotionValue } from "framer-motion";
import { StaticImageData } from "next/image";

export type TtextHoverProps = {
   titile1: string;
   titile2: string;
};

export type TmarqueeProps = {
   titile1: string;
   titile2: string;
   className: string;
};

export type Tcardsprops = {
   i: number,
   title: string,
   para: string,
   heading1: string,
   heading2: string,
   src: StaticImageData,
   href: string,
   bgColor: string,
   textColor: string,
   linkColor: string,
   progress: MotionValue<number>,
   range?: any,
};

export type TParagraphProps = {
   paragraph: string;
   minOffset?: number; // Optional prop for minimum offset
   maxOffset?: number; // Optional prop for maximum offset
};

export type TWordProps = {
   children: string;
   progress: MotionValue<number>;
   range: number[];
};

export interface AnimatedTextSectionProps {
  svgPath?: string; 
  translationKey: string;
  bgColor?: string;
  textColor?: string;
  paragraphWidth?: string; // Optional prop for paragraph width
}

export interface ParagraphProps {
  translationKey: string;
  bgColor?: string;
  textColor?: string;
  paragraphWidth?: string;
  buttonLabel?: string;
  buttonLabel2?: string; // Optional prop for button label
  buttonHref?: string;
  buttonBgColor?: string; // Optional prop for button background color
  buttonTextColor?: string;
  numberOfParagraphs?: number; // Optional prop for number of paragraphs
}

// types/index.ts
export interface ReusableSliderProps {
	translationKey: string;
	numberOfSlides: number;
	bgColor?: string; // Colore di sfondo del div principale (es. "#FFD7EF")
	textColor?: string; // Nuovo: Colore dei titoli principali sopra lo slider (es. "#260A2F")
	sliderCardBgColor?: string; // Colore di sfondo delle slide (es. "#260A2F")
	sliderCardTextColor?: string; // Colore del testo all'interno delle slide (es. "#FFD7EF")
	arrowButtonBgColor?: string; // Colore di sfondo dei bottoni freccia (es. "#9fe870")
	arrowButtonHoverColor?: string; // Colore di hover dei bottoni freccia (es. "#FFEB69")
}