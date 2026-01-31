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
  svgPositionClasses?: string; // Optional prop for SVG position classes
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

export interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    image: ImageFormat;
    thumbnail: ImageFormat;

  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ParagraphBlock {
  __component: "text-components.paragraph";
  id: number;
  text: string;
  cssClasses: string;
  imagePosition: string;
  imageAlt: string;
  image: Image | null; // Assuming the image can be null if not provided
}

export interface HeroBlock {
  __component: "image-components.hero";
  id: number;
  title: string;
  caption: string;
  imageAlt: string;
  cssClasses: string;
  bgImage: Image; // Assuming this is a single image object
}

export interface QuoteBlock {
  __component: "text-components.quote";
  id: number;
  text: string;
  author: string;
  authorInfo: string;
  authorLifespan: string;
  cssClasses: string;
}

export interface CtaBlock {
  __component: "functional-components.cta";
  id: number;
  title: string;
  subtitle: string;
  paragraph: string;
  buttonLabel: string;
  buttonHref: string;
  cssClasses: string;
  displayMode: string;
}

export interface GalleryBlock {
  __component: "image-components.gallery";
  id: number;
  caption: string;
  displayMode: string;
  images: Image[]; // Assuming this is an array of image objects
}

export type ContentBlock =
  | ParagraphBlock
  | HeroBlock
  | QuoteBlock
  | CtaBlock
  | GalleryBlock;




export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: Pagination;
  };
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  subtitle: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  caption: string;
  slug: string;
  openGraphTitle: string;
  openGraphDescription: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  thumbnail: Image;
  openGraphImage: Image;
  contentBlocks: ContentBlock[];
  relatedArticles: any[]; // Consider defining a more specific type if the structure of related articles is known.
  articles: any[]; // Consider defining a more specific type if the structure of articles is known.
  tags: any[]; // Consider defining a more specific type if the structure of tags is known.
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface Meta {
  pagination: Pagination;
}

export interface ArticleData {
  data: Article[];
  meta: Meta;
}

export interface Customer {
  // Campi semplici
  name?: string;
  email: string;
  phone: string;
  isKhmer: boolean;
  wantsNewsletter: boolean;
}


// 1. Definizione per il componente all'interno della Dynamic Zone "package"
export interface PackageComponent {
  id: number;
  __component?: string; // Utile se hai più componenti nella dynamic zone
  minutes: number;
  price: number;
  discountedPrice: number | null; // O 'number | null' se il campo non è obbligatorio
}

// 2. Definizione per l'Enumeration "category"
// Sostituisci le stringhe qui sotto con i valori reali che hai impostato in Strapi
export type TreatmentCategory = 'Massage' | 'Bodycare and Beauty' | string;

// 3. Interfaccia principale per il Content Type "Treatment"
export interface Treatment {
  id: number;
  documentId: string; // Strapi v5 usa spesso documentId, altrimenti usa solo id
  title: string;
  description: string;
  category: TreatmentCategory;
  khTitle: string | null;
  khDescription: string | null;
  
  // Le Dynamic Zones in Strapi sono sempre array
  packages: PackageComponent[]; 

  // Campi standard generati da Strapi
  createdAt: string;
  updatedAt: string;
  publishedAt?: string; // Opzionale perché potrebbe essere una bozza
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'done' | string;

export interface Booking {
  id:string;
  documentId: string;
  // Campi semplici
  date: string;         // Strapi restituisce le date come stringa 'YYYY-MM-DD'
  time: string;         // Strapi restituisce il tempo come stringa 'HH:mm:ss.SSS'
  duration: number;     // Number
  price: number;        // Number
  
  // Enumeration
  bookingStatus: BookingStatus;

  // Campi di testo (Long Text o Text)
  notes?: string;            // Opzionale (può essere null)
  cancellationNotes?: string; // Opzionale

  // Relazioni (in Strapi v4 arrivano dentro un oggetto { data: ... })
  treatment?: Treatment ;
  customer?:  Customer ;
  masseuse?:  Masseuse ;

  // Campi standard di Strapi
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Masseuse {
  name: string;
  bookings: [];
}