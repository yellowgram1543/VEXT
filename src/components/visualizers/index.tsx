'use client';

import React from 'react';
import MLVisualizer from '../MLVisualizer';
import ProbabilityVisualizer from '../ProbabilityVisualizer';
import GeometryVisualizer from './GeometryVisualizer';
import GraphVisualizer from './GraphVisualizer';
import GridVisualizer from './GridVisualizer';
import Simulator from './Simulator';
import Comparator from './Comparator';
import Playground from './Playground';
import PipelineVisualizer from './PipelineVisualizer';
import InterpreterVisualizer from './InterpreterVisualizer';
import SandboxVisualizer from './SandboxVisualizer';

/**
 * The Visualizer Registry acts as the "lens library" for our projector.
 * Content can specify a visualizer by its key, and the projector will
 * swap in the correct component.
 */
export const VisualizerRegistry = {
  'loss': (props: any) => <MLVisualizer type="loss" {...props} />,
  'distribution': (props: any) => <MLVisualizer type="distribution" {...props} />,
  'boundary': (props: any) => <MLVisualizer type="boundary" {...props} />,
  'probability': (props: any) => <ProbabilityVisualizer {...props} />,
  'geometry': (props: any) => <GeometryVisualizer {...props} />,
  'graph': (props: any) => <GraphVisualizer {...props} />,
  'grid': (props: any) => <GridVisualizer {...props} />,
  'simulator': (props: any) => <Simulator {...props} />,
  'comparator': (props: any) => <Comparator {...props} />,
  'playground': (props: any) => <Playground {...props} />,
  'pipeline': (props: any) => <PipelineVisualizer {...props} />,
  'interpreter': (props: any) => <InterpreterVisualizer {...props} />,
  'sandbox': (props: any) => <SandboxVisualizer {...props} />,
};

export type VisualizerKey = keyof typeof VisualizerRegistry;

interface VisualizerProps {
  name?: string;
  data?: any;
  title?: string;
  className?: string;
}

export default function Visualizer({ name, data, title, className }: VisualizerProps) {
  if (!name || !(name in VisualizerRegistry)) {
    return null;
  }

  const Component = VisualizerRegistry[name as VisualizerKey];
  return <Component data={data} title={title} className={className} />;
}
