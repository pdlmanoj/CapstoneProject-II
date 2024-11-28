import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ResourceSidebar from './ResourceSidebar';
import { toPng } from 'html-to-image';

const RoadmapFlow = ({ roadmapData, prompt }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set(['root']));
  const [nodeHeights, setNodeHeights] = useState({});
  const [isInitialRender, setIsInitialRender] = useState(true);
  const nodeRefs = useRef({});
  const layoutTimeoutRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const flowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Constants for layout
  const NODE_STYLES = {
    ROOT: {
      background: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '15px',
      borderRadius: '8px',
      width: 300,
    },
    SUBTOPIC: {
      background: '#2196F3',
      color: 'white',
      border: 'none',
      padding: '15px',
      borderRadius: '8px',
      width: 300,
    },
    CHILD: {
      background: '#FF9800',
      color: 'white',
      border: 'none',
      padding: '10px',
      borderRadius: '8px',
      width: 280,
    },
  };

  // Function to measure node heights
  const measureNode = useCallback((nodeId, node) => {
    if (node && nodeRefs.current[nodeId] !== node) {
      nodeRefs.current[nodeId] = node;
      const height = node.getBoundingClientRect().height;
      setNodeHeights(prev => ({
        ...prev,
        [nodeId]: height
      }));
    }
  }, []);

  // Function to get the maximum subtopic height
  const getMaxSubtopicHeight = useCallback(() => {
    const subtopicHeights = Object.entries(nodeHeights)
      .filter(([key]) => key.startsWith('subtopic-'))
      .map(([_, height]) => height);
    return Math.max(...subtopicHeights, 70);
  }, [nodeHeights]);

  // Combined handler for node click
  const handleNodeClick = useCallback((nodeId, node) => {
    // Toggle node expansion
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        // If opening a subtopic, close other subtopics
        if (nodeId.startsWith('subtopic-')) {
          Array.from(newSet).forEach(id => {
            if (id.startsWith('subtopic-')) {
              newSet.delete(id);
            }
          });
        }
        newSet.add(nodeId);
      }
      return newSet;
    });

    // Open resource sidebar if it's a subtopic
    if (nodeId.startsWith('subtopic-')) {
      setSelectedNode(node);
      setIsSidebarOpen(true);
    }
  }, []);

  const createNodesAndEdges = useCallback((data) => {
    const nodes = [];
    const edges = [];

    // Constants for layout
    const MAX_SUBTOPICS = 5;
    const ROOT_TO_SUBTOPIC_SPACING = 250;
    const SUBTOPIC_TO_CHILD_SPACING = isInitialRender ? 200 : getMaxSubtopicHeight() + 100;
    const CHILD_VERTICAL_SPACING = 180;
    const HORIZONTAL_SPACING = 400;
    const TOTAL_WIDTH = (data.subtopics.slice(0, MAX_SUBTOPICS).length - 1) * HORIZONTAL_SPACING;

    // Add root node
    const startX = 0;
    const startY = 0;

    nodes.push({
      id: 'root',
      position: { x: startX, y: startY },
      data: {
        label: (
          <div
            ref={(node) => measureNode('root', node)}
            onClick={() => handleNodeClick('root', {
              id: 'root',
              data: { label: data.title }
            })}
            style={{ width: '100%' }}
          >
            {data.title}
            <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
              {expandedNodes.has('root') ? '(Click to collapse)' : '(Click to expand)'}
            </div>
          </div>
        )
      },
      style: NODE_STYLES.ROOT,
    });

    if (expandedNodes.has('root') && data.subtopics) {
      const limitedSubtopics = data.subtopics.slice(0, MAX_SUBTOPICS);

      limitedSubtopics.forEach((subtopic, index) => {
        const subtopicId = `subtopic-${index}`;
        // Calculate x position to center the subtopics relative to the root
        const x = startX - (TOTAL_WIDTH / 2) + (index * HORIZONTAL_SPACING);
        const y = ROOT_TO_SUBTOPIC_SPACING;

        nodes.push({
          id: subtopicId,
          position: { x, y },
          data: {
            label: (
              <div
                ref={(node) => measureNode(subtopicId, node)}
                onClick={() => handleNodeClick(subtopicId, {
                  id: subtopicId,
                  data: { label: subtopic.title }
                })}
                style={{ width: '100%' }}
              >
                {subtopic.title}
                <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
                  {expandedNodes.has(subtopicId) ? '(Click to collapse)' : '(Click to expand)'}
                </div>
              </div>
            )
          },
          style: NODE_STYLES.SUBTOPIC,
        });

        edges.push({
          id: `edge-root-${subtopicId}`,
          source: 'root',
          target: subtopicId,
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#1976D2', strokeWidth: 2 },
          animated: true,
        });

        if (expandedNodes.has(subtopicId) && subtopic.children) {
          subtopic.children.forEach((child, childIndex) => {
            const childId = `child-${index}-${childIndex}`;
            const childY = y + SUBTOPIC_TO_CHILD_SPACING + (childIndex * CHILD_VERTICAL_SPACING);

            nodes.push({
              id: childId,
              position: { x, y: childY },
              data: {
                label: child.title,
                originalTitle: child.title // Store original title for resource sidebar
              },
              style: NODE_STYLES.CHILD,
            });

            edges.push({
              id: `edge-${subtopicId}-${childId}`,
              source: subtopicId,
              target: childId,
              type: 'smoothstep',
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { stroke: '#F57C00', strokeWidth: 2 },
            });
          });
        }
      });
    }

    return { nodes, edges };
  }, [expandedNodes, isInitialRender, getMaxSubtopicHeight, measureNode]);

  // Reset view
  const resetView = useCallback(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.setViewport({ x: 0, y: 0, zoom: 1 });
      reactFlowInstance.current.fitView({ padding: 0.2 });
      setIsSidebarOpen(false);
      setSelectedNode(null);
      setExpandedNodes(new Set(['root']));
    }
  }, []);

  const downloadImage = useCallback(() => {
    if (reactFlowInstance.current) {
      const flowElement = document.querySelector('.react-flow');
      
      if (flowElement) {
        // Store current expanded nodes state
        const previousExpandedNodes = new Set(expandedNodes);
        
        // Get all node IDs
        const allNodeIds = nodes.map(node => node.id);
        
        // Expand all nodes
        setExpandedNodes(new Set(allNodeIds));
        
        // Wait for nodes to expand and re-render
        setTimeout(() => {
          // Fit view to ensure all nodes are visible
          reactFlowInstance.current.fitView({ padding: 0.2 });

          toPng(flowElement, {
            backgroundColor: '#1a1a1a',
            quality: 1,
            pixelRatio: 2,
            style: {
              padding: '20px'
            }
          })
          .then((dataUrl) => {
            // Create a download link
            const link = document.createElement('a');
            link.download = 'roadmap.png';
            link.href = dataUrl;
            link.click();
            
            // Restore previous expanded nodes state
            setExpandedNodes(previousExpandedNodes);
          })
          .catch((error) => {
            console.error('Error generating image:', error);
            // Restore previous expanded nodes state in case of error
            setExpandedNodes(previousExpandedNodes);
          });
        }, 500); // Wait for 500ms to ensure nodes are expanded
      }
    }
  }, [expandedNodes, nodes, reactFlowInstance]);

  // Effect to handle initial render and updates
  useEffect(() => {
    const newGraph = createNodesAndEdges(roadmapData);
    setNodes(newGraph.nodes);
    setEdges(newGraph.edges);

    if (isInitialRender) {
      layoutTimeoutRef.current = setTimeout(() => {
        setIsInitialRender(false);
      }, 500);
    }

    return () => {
      if (layoutTimeoutRef.current) {
        clearTimeout(layoutTimeoutRef.current);
      }
    };
  }, [roadmapData, createNodesAndEdges, isInitialRender]);

  return (
    <div ref={flowWrapper} style={{ width: '100%', height: '100vh' }} className={isFullScreen ? 'fullscreen' : ''}>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={resetView}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
          </svg>
          <span>Reset View</span>
        </button>
        <button
          onClick={downloadImage}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
          <span>Download Image</span>
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={(instance) => {
          reactFlowInstance.current = instance;
          instance.fitView({ padding: 0.2 });
        }}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.style?.background) {
              case '#4CAF50': return '#4CAF50';
              case '#2196F3': return '#2196F3';
              default: return '#FF9800';
            }
          }}
        />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      <ResourceSidebar
        isOpen={isSidebarOpen}
        selectedNode={selectedNode}
        onClose={() => {
          setIsSidebarOpen(false);
          setSelectedNode(null);
        }}
      />
    </div>
  );
};

export default RoadmapFlow;
