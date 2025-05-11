
export interface UpcomingEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  modality: 'Presencial' | 'Virtual';
  locationOrLink: string;
  linkText: string;
  status: 'Próximo' | 'En curso' | 'Finalizado';
  image: string;
  aiHint: string;
  description: string;
}
