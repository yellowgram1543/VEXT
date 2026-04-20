export interface Module {
  _id: string;
  title: string;
  description: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  order: number;
  chapters?: Chapter[];
}

export interface Chapter {
  _id: string;
  title: string;
  slug: { current: string };
  module: { _ref: string };
  order: number;
  content: any[]; // Portable Text from Sanity
  completed?: boolean;
}
