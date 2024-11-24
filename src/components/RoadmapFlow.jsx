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
    
    return Math.max(...subtopicHeights, 70); // Default to 70px if no heights measured
  }, [nodeHeights]);

  const toggleNode = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const createNodesAndEdges = (data) => {
    const nodes = [];
    const edges = [];

    // Constants for layout
    const MAX_SUBTOPICS = 5; // Maximum number of subtopics to display
    const ROOT_TO_SUBTOPIC_SPACING = 250;
    const SUBTOPIC_TO_CHILD_SPACING = isInitialRender 
      ? 200
      : getMaxSubtopicHeight() + 100;
    const CHILD_VERTICAL_SPACING = 180; // Increased spacing between children
    const CHILD_CONNECTOR_HEIGHT = 60; // Height of the vertical connector line
    const HORIZONTAL_SPACING = 300;
    const NODE_WIDTH = {
      ROOT: 300,
      SUBTOPIC: 300,
      CHILD: 280
    };

    // Common node styles
    const commonNodeStyle = {
      padding: '16px',
      borderRadius: '8px',
      textAlign: 'center',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      lineHeight: '1.4',
      minHeight: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    };

    const NODE_STYLES = {
      ROOT: {
        ...commonNodeStyle,
        background: '#2196F3',
        border: '2px solid #1976D2',
        color: 'white',
      },
      SUBTOPIC: {
        ...commonNodeStyle,
        background: '#2196F3',
        border: '2px solid #1976D2',
        color: 'white',
      },
      CHILD: {
        ...commonNodeStyle,
        background: '#FF9800',
        border: '2px solid #F57C00',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'normal',
        minHeight: '60px',
        cursor: 'default',
      }
    };

    // Add root node
    nodes.push({
      id: 'root',
      position: { x: 0, y: 0 },
      data: { 
        label: (
          <div 
            ref={(node) => measureNode('root', node)}
            onClick={() => toggleNode('root')} 
            style={{ width: '100%' }}
          >
            {prompt || 'Roadmap'}
            <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
              {expandedNodes.has('root') ? '(Click to collapse)' : '(Click to expand)'}
            </div>
          </div>
        )
      },
      style: {
        ...NODE_STYLES.ROOT,
        borderBottom: 'none',
      },
    });

    if (data.subtopics && expandedNodes.has('root')) {
      // Limit the number of subtopics
      const limitedSubtopics = data.subtopics.slice(0, MAX_SUBTOPICS);
      const numSubtopics = limitedSubtopics.length;
      
      // Calculate starting X position to center the subtopics
      const startX = -(numSubtopics * HORIZONTAL_SPACING) / 2 + HORIZONTAL_SPACING / 2;

      // Add separator line
      nodes.push({
        id: 'separator',
        position: { 
          x: startX - 50,
          y: ROOT_TO_SUBTOPIC_SPACING - 30
        },
        data: {
          label: (
            <div style={{
              width: (numSubtopics * HORIZONTAL_SPACING) + 100,
              height: '2px',
              backgroundColor: '#1976D2',
              opacity: 0.5
            }}/>
          )
        },
        style: {
          background: 'none',
          border: 'none',
          width: 'auto',
          pointerEvents: 'none'
        }
      });

      // Add "More Topics" indicator if there are additional subtopics
      if (data.subtopics.length > MAX_SUBTOPICS) {
        const moreTopicsX = startX + (numSubtopics * HORIZONTAL_SPACING);
        nodes.push({
          id: 'more-topics',
          position: { 
            x: moreTopicsX, 
            y: ROOT_TO_SUBTOPIC_SPACING 
          },
          data: {
            label: (
              <div style={{
                padding: '10px',
                color: '#666',
                fontSize: '14px',
                fontStyle: 'italic'
              }}>
                +{data.subtopics.length - MAX_SUBTOPICS} more topics
              </div>
            )
          },
          style: {
            background: 'none',
            border: 'none',
            width: 'auto',
            pointerEvents: 'none'
          }
        });
      }

      limitedSubtopics.forEach((subtopic, index) => {
        const subtopicId = `subtopic-${index}`;
        const x = startX + (index * HORIZONTAL_SPACING);
        const y = ROOT_TO_SUBTOPIC_SPACING;

        nodes.push({
          id: subtopicId,
          position: { x, y },
          data: { 
            label: (
              <div 
                ref={(node) => measureNode(subtopicId, node)}
                onClick={() => toggleNode(subtopicId)} 
                style={{ width: '100%' }}
              >
                {subtopic.title}
                <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
                  {expandedNodes.has(subtopicId) ? '(Click to collapse)' : '(Click to expand)'}
                </div>
              </div>
            )
          },
          style: {
            ...NODE_STYLES.SUBTOPIC,
            borderTop: '2px solid #1976D2',
          },
        });

        edges.push({
          id: `edge-root-${subtopicId}`,
          source: 'root',
          target: subtopicId,
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { 
            stroke: '#1976D2',
            strokeWidth: 2,
          },
          animated: true,
        });

        if (subtopic.children && expandedNodes.has(subtopicId)) {
          subtopic.children.forEach((child, childIndex) => {
            const childId = `child-${index}-${childIndex}`;
            const childY = y + SUBTOPIC_TO_CHILD_SPACING + (childIndex * CHILD_VERTICAL_SPACING);

            // Add child node
            nodes.push({
              id: childId,
              position: { x, y: childY },
              draggable: false,
              data: { 
                label: (
                  <div 
                    style={{ 
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.4'
                    }}>
                      {child.title}
                    </div>
                  </div>
                )
              },
              style: NODE_STYLES.CHILD,
            });

            // Add single direct edge from subtopic to child
            edges.push({
              id: `edge-${subtopicId}-${childId}`,
              source: subtopicId,
              target: childId,
              type: 'smoothstep',
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { 
                stroke: '#F57C00',
                strokeWidth: 2,
              },
            });
          });
        }
      });
    }

    return { nodes, edges };
  };

  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setIsSidebarOpen(true);
  }, []);

  // Handle sidebar close
  const onSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
    setSelectedNode(null);
  }, []);

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Reset view to center
  const resetView = useCallback(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.setViewport({ x: 0, y: 0, zoom: 1 });
      reactFlowInstance.current.fitView({ padding: 0.2 });
    }
  }, []);

  // Effect to handle initial render and subsequent updates
  useEffect(() => {
    if (isInitialRender) {
      // Wait for nodes to be measured before updating layout
      layoutTimeoutRef.current = setTimeout(() => {
        setIsInitialRender(false);
      }, 500); // Give time for measurements
    }

    const newGraph = createNodesAndEdges(roadmapData);
    setNodes(newGraph.nodes);
    setEdges(newGraph.edges);

    return () => {
      if (layoutTimeoutRef.current) {
        clearTimeout(layoutTimeoutRef.current);
      }
    };
  }, [expandedNodes, nodeHeights, roadmapData, isInitialRender]);

  useEffect(() => {
    if (roadmapData) {
      const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(roadmapData);
      setNodes(newNodes);
      setEdges(newEdges);
      
      // Center the view after a short delay to ensure nodes are rendered
      setTimeout(() => {
        resetView();
      }, 100);
    }
  }, [roadmapData, expandedNodes, nodeHeights]);

  return (
    <div 
      ref={flowWrapper}
      style={{
        width: '100%',
        height: isFullScreen ? '100vh' : '100vh',
        position: 'relative',
      }}
      className={isFullScreen ? 'fixed top-0 left-0 z-50 bg-gray-900' : ''}
    >
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={resetView}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
          </svg>
          <span>Reset View</span>
        </button>
        <button
          onClick={toggleFullScreen}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
        >
          {isFullScreen ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4a1 1 0 0 0-1 1v4a1 1 0 0 1-2 0V5a3 3 0 0 1 3-3h4a1 1 0 0 1 0 2H5zm10 0a1 1 0 0 1 1 1v4a1 1 0 1 0 2 0V5a3 3 0 0 0-3-3h-4a1 1 0 1 0 0 2h4z" clipRule="evenodd"/>
                <path fillRule="evenodd" d="M5 16a1 1 0 0 1-1-1v-4a1 1 0 1 0-2 0v4a3 3 0 0 0 3 3h4a1 1 0 1 0 0-2H5zm10 0a1 1 0 0 0 1-1v-4a1 1 0 1 1 2 0v4a3 3 0 0 1-3 3h-4a1 1 0 1 1 0-2h4z" clipRule="evenodd"/>
              </svg>
              <span>Exit Fullscreen</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1zm12 0a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1zM3 16a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm12 0a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1z" clipRule="evenodd"/>
              </svg>
              <span>Fullscreen</span>
            </>
          )}
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onInit={(instance) => {
          reactFlowInstance.current = instance;
          resetView();
        }}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls 
          style={{
            button: {
              backgroundColor: '#333',
              color: '#fff',
              border: '1px solid #444',
            },
          }}
        />
        <MiniMap 
          style={{
            backgroundColor: '#333',
            maskColor: '#666',
          }}
          nodeColor={(node) => {
            switch (node.style?.background) {
              case '#4CAF50': return '#4CAF50';
              case '#2196F3': return '#2196F3';
              default: return '#FF9800';
            }
          }}
        />
        <Background 
          variant="dots" 
          gap={12} 
          size={1} 
          color="#333" 
        />
      </ReactFlow>

      <ResourceSidebar
        isOpen={isSidebarOpen}
        selectedNode={selectedNode}
        onClose={onSidebarClose}
      />
    </div>
  );
};

export default RoadmapFlow;
